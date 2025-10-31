
// scripts.js - handles signup form, localStorage and JSON download for demo
function getSkills(containerId) {
  const container = document.getElementById(containerId);
  const inputs = container.querySelectorAll('input[type="text"]');
  const values = [];
  inputs.forEach(i => {
    if(i.value && i.value.trim() !== '') values.push(i.value.trim());
  });
  return values;
}

function addInput(containerId) {
  const container = document.getElementById(containerId);
  const idx = container.querySelectorAll('input').length + 1;
  const input = document.createElement('input');
  input.type = 'text';
  input.id = containerId + '_new_' + idx;
  input.placeholder = 'مهارت جدید';
  container.appendChild(input);
  input.focus();
}

function saveProfile(profile) {
  // Save to localStorage (demo)
  localStorage.setItem('skillswap_profile', JSON.stringify(profile));
}

function loadProfile() {
  const raw = localStorage.getItem('skillswap_profile');
  if(!raw) return null;
  try { return JSON.parse(raw); } catch(e){ return null; }
}

function renderProfile() {
  const profile = loadProfile();
  const container = document.getElementById('profileContent');
  const downloadLink = document.getElementById('downloadLink');
  if(!container) return;
  if(!profile) {
    container.innerHTML = '<p>پروفایل خالی است. ابتدا در صفحه ثبت‌نام اطلاعات را وارد و ثبت کن.</p>';
    if(downloadLink) downloadLink.style.display = 'none';
    return;
  }
  let html = '<div class="profile-info">';
  html += '<p><strong>نام:</strong> ' + (profile.name || '') + '</p>';
  html += '<p><strong>ایمیل:</strong> ' + (profile.email || '') + '</p>';
  html += '<p><strong>بیو:</strong> ' + (profile.bio || '') + '</p>';
  html += '<p><strong>سطح کلی:</strong> ' + (profile.level || '') + '</p>';
  html += '<p><strong>توانایی‌ها (می‌توانم بدهم):</strong> ' + (profile.skills_give.join('، ') || '-') + '</p>';
  html += '<p><strong>نیازها (می‌خواهم بگیرم):</strong> ' + (profile.skills_need.join('، ') || '-') + '</p>';
  html += '</div>';
  container.innerHTML = html;
  if(downloadLink) {
    // prepare JSON blob for download
    const blob = new Blob([JSON.stringify(profile, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = (profile.name || 'profile') + '_skillswap.json';
    downloadLink.style.display = 'inline-block';
  }
}

document.addEventListener('DOMContentLoaded', function(){
  // Attach events on signup page
  const form = document.getElementById('signupForm');
  if(form) {
    document.getElementById('addGive').addEventListener('click', function(e){ addInput('skills_give'); });
    document.getElementById('addNeed').addEventListener('click', function(e){ addInput('skills_need'); });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const profile = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        bio: document.getElementById('bio').value.trim(),
        level: document.getElementById('level').value,
        skills_give: getSkills('skills_give'),
        skills_need: getSkills('skills_need'),
        created_at: new Date().toISOString()
      };
      if(profile.skills_give.length === 0 || profile.skills_need.length === 0) {
        document.getElementById('message').innerText = 'لطفاً حداقل یک مهارت قابل ارائه و یک مهارت مورد نیاز وارد کنید.';
        return;
      }
      saveProfile(profile);
      document.getElementById('message').innerText = 'پروفایل با موفقیت ذخیره شد. برای مشاهده به صفحه پروفایل بروید.';
      setTimeout(()=>{ window.location.href = 'profile.html'; }, 900);
    });
    document.getElementById('downloadJson').addEventListener('click', function(){
      const profile = loadProfile() || {};
      // if form filled but not saved, collect current values
      if(Object.keys(profile).length === 0) {
        const p = {
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          bio: document.getElementById('bio').value.trim(),
          level: document.getElementById('level').value,
          skills_give: getSkills('skills_give'),
          skills_need: getSkills('skills_need'),
          created_at: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(p, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (p.name || 'profile') + '_skillswap.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(profile, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (profile.name || 'profile') + '_skillswap.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    });
  }

  // Attach events on profile page
  const clearBtn = document.getElementById('clearData');
  if(clearBtn) {
    clearBtn.addEventListener('click', function(){
      if(confirm('آیا مطمئنید می‌خواهید داده محلی حذف شود؟')) {
        localStorage.removeItem('skillswap_profile');
        renderProfile();
      }
    });
  }

  // Render profile if on profile page
  renderProfile();
});
