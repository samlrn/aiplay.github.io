const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4sY19hjNQq0s6tZTeFb77Rv_QcWVOKxwf2dASHdoQniG2XoQYPht1qYDKZGqoZ2BBHS5nbjcFIkJ/pub?output=csv";

function uniqueSorted(values) {
  return [...new Set(values.filter(v => v && v.toString().trim()))]
    .sort((a, b) => a.localeCompare(b));
}

function findColumn(headers, patterns) {
  const lower = headers.map(h => h.toLowerCase());
  for (const p of patterns) {
    const idx = lower.findIndex(h => h.includes(p));
    if (idx !== -1) return headers[idx];
  }
  return null;
}

async function loadData() {
  return new Promise((resolve, reject) => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: results => resolve(results.data),
      error: err => reject(err)
    });
  });
}

(async function init() {
  const data = await loadData();
  if (!data.length) throw new Error("No rows found in CSV.");

  const headers = Object.keys(data[0]);

  const titleCol = findColumn(headers, ["title", "name", "resource"]);
  const subjectCol = findColumn(headers, ["subject", "content area", "discipline"]);
  const gradeCol = findColumn(headers, ["grade", "grade level", "grades"]);
  const descCol = findColumn(headers, ["description", "summary", "notes"]);
  const linkCol = findColumn(headers, ["link", "url", "href", "website"]);

  const displayCols = [];
  for (const col of [titleCol, subjectCol, gradeCol, descCol, linkCol]) {
    if (col && !displayCols.includes(col)) displayCols.push(col);
  }
  headers.forEach(h => { if (!displayCols.includes(h)) displayCols.push(h); });

  const headRow = document.getElementById("table-head");
  displayCols.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    headRow.appendChild(th);
  });

  const rows = data.map(row => {
    return displayCols.map(col => {
      const val = row[col] ?? "";
      if (linkCol && col === linkCol && val) {
        const url = val.trim();
        return `<a href="${url}" target="_blank" rel="noopener">Open</a>`;
      }
      return val;
    });
  });

  const table = $("#resources").DataTable({
    data: rows,
    columns: displayCols.map(col => ({
      title: col,
      orderable: col === linkCol ? false : true
    })),
    pageLength: 25,
    order: [[0, "asc"]],
    dom: "tipr"
  });

  document.getElementById("global-search").addEventListener("input", (e) => {
    table.search(e.target.value).draw();
  });

  if (subjectCol) {
    const subjectIdx = displayCols.indexOf(subjectCol);
    const subjects = data.map(r => r[subjectCol]);
    const select = document.getElementById("filter-subject");
    uniqueSorted(subjects).forEach(val => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val;
      select.appendChild(opt);
    });
    document.getElementById("subject-filter-wrap").classList.remove("d-none");
    select.addEventListener("change", (e) => {
      const val = e.target.value;
      table.column(subjectIdx)
        .search(val ? "^" + $.fn.dataTable.util.escapeRegex(val) + "$" : "", true, false)
        .draw();
    });
  }

  if (gradeCol) {
    const gradeIdx = displayCols.indexOf(gradeCol);
    const grades = data.map(r => r[gradeCol]);
    const select = document.getElementById("filter-grade");
    uniqueSorted(grades).forEach(val => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val;
      select.appendChild(opt);
    });
    document.getElementById("grade-filter-wrap").classList.remove("d-none");
    select.addEventListener("change", (e) => {
      const val = e.target.value;
      table.column(gradeIdx)
        .search(val ? "^" + $.fn.dataTable.util.escapeRegex(val) + "$" : "", true, false)
        .draw();
    });
  }
})().catch(err => {
  console.error(err);
  alert("Failed to load data. Check the CSV URL or publishing settings.");
});
