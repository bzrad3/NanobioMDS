async function loadTable(csvUrl, tableId) {
  const text = await (await fetch(csvUrl)).text();
  const { data } = Papa.parse(text.trim(), { skipEmptyLines: true });
  const head = data.shift();
  const table = document.getElementById(tableId);

  const headRow = table.createTHead().insertRow();
  head.forEach((h, i) => {
    const th = document.createElement('th');
    th.textContent = h;
    th.onclick = () => sortTable(table, i);
    headRow.appendChild(th);
  });

  const tbody = table.createTBody();
  data.forEach(r => {
    const tr = tbody.insertRow();
    r.forEach(c => {
      const td = tr.insertCell();
      if (/^https?:\/\//.test(c)) {
        const a = document.createElement('a');
        a.href = c; a.textContent = 'link'; a.target = '_blank';
        td.appendChild(a);
      } else {
        td.textContent = c;
      }
    });
  });
}

function filterTable(table, q) {
  q = q.toLowerCase();
  Array.from(table.tBodies[0].rows).forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function sortTable(table, col) {
  const asc = table.dataset.sortCol == col && table.dataset.sortDir === 'asc' ? false : true;
  table.dataset.sortCol = col;
  table.dataset.sortDir = asc ? 'asc' : 'desc';
  const rows = Array.from(table.tBodies[0].rows);
  rows.sort((a, b) => {
    const cmp = a.cells[col].textContent.localeCompare(
      b.cells[col].textContent, undefined, { numeric: true });
    return asc ? cmp : -cmp;
  });
  rows.forEach(r => table.tBodies[0].appendChild(r));
}
