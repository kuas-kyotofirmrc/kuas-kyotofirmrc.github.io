// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(target).classList.add('active');

    history.replaceState(null, '', '#' + target);
  });
});

function restoreTab() {
  const hash = location.hash.replace('#', '');
  if (hash) {
    const btn = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
    if (btn) btn.click();
  }
}

async function loadSeminars() {
  const container = document.getElementById('seminars-list');
  if (!container) return;

  try {
    const res = await fetch('../seminars/index.json');
    if (!res.ok) throw new Error('not found');
    const seminars = await res.json();

    if (seminars.length === 0) {
      container.innerHTML = '<p>Seminar information will be posted soon.</p>';
      return;
    }

    container.innerHTML = seminars.map(s => {
      const announcementLink = s.announcement && s.announcement.url !== undefined
        ? (s.announcement.type === 'md'
            ? `<a href="../seminars/seminar.html?file=${s.id}.md">Announcement (JP)↗</a>`
            : `<a href="${s.announcement.url}" target="_blank" rel="noopener">Announcement (JP)↗</a>`)
        : '';
      const reportLink = s.report && s.report.url
        ? `<a href="${s.report.url}" target="_blank" rel="noopener">Report (JP)↗</a>`
        : '';
      const link = [announcementLink, reportLink].filter(Boolean).join('<span style="display:inline-block;width:1.5rem"></span>');

      return `
        <div class="seminar-card">
          <h3>${s.title}</h3>
          <div class="seminar-meta">${s.date}</div>
          ${s.description ? `<p style="font-size:0.95rem;color:#1a1a1a;margin-bottom:0.6rem">${s.description}</p>` : ''}
          <div class="seminar-links">${link}</div>
        </div>
      `;
    }).join('');
  } catch {
    container.innerHTML = '<p>Seminar information will be posted soon.</p>';
  }
}

restoreTab();
loadSeminars();
