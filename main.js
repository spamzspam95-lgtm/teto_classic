/* script.js - نسخة للعمل مع منتجات HTML ثابتة */
const OWNER_NUMBER = '+201150843060'; // رقم صاحب المتجر
const WA_BASE = 'https://l.instagram.com/?u=http%3A%2F%2Fwa.me%2F201275533360%3Ffbclid%3DPAZXh0bgNhZW0CMTEAAaczW1RJ2BEd0W8yfH_4AHq7M4soa8sFc7VC4oIVG1atcGZqs0XU8-83U4JR2Q_aem_ZB7TaoUA0siYtThaNvwf_g&e=AT0aBbmxL0L16PFnlnEwk6Qs-AkezdLn_2SxMcZMcAidPyLVWuGteNmeCzyi3PcMv03oC8DKhW-77CevbNyXO1eitxAHj0VnEvFsPXsWrA';

const grid = document.getElementById('products-grid');
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// عناصر المودال/الفورم (تأكد إن نفس الـ IDs موجودة في index.html)
const modal = document.getElementById('order-modal');
const modalProduct = document.getElementById('modal-product');
const modalClose = document.querySelector('.modal-close');
const modalCancel = document.querySelector('.modal-cancel');
const orderForm = document.getElementById('order-form');

// 1) تفعيل نقر على التصغيرات (thumbnails) لكل بطاقة
document.querySelectorAll('.card').forEach(card => {
  const thumbs = card.querySelectorAll('.thumb');
  const mainImg = card.querySelector('.main-img img');
  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      const thumbImg = t.querySelector('img');
      if (thumbImg && thumbImg.src) {
        mainImg.src = thumbImg.src;
        mainImg.dataset.current = t.dataset.index || '0';
      }
    });
  });
});

// 2) التعامل مع أزرار "اطلب الآن" و "عرض"
document.addEventListener('click', (e) => {
  const orderBtn = e.target.closest('.order-now');
  if (orderBtn) {
    const card = orderBtn.closest('.card');
    if (!card) return;
    const title = (card.querySelector('h3')||{textContent:''}).textContent.trim();
    const price = (card.querySelector('.price')||{textContent:''}).textContent.trim();
    openModalWithProduct({ title, price });
    return;
  }

  const detailsBtn = e.target.closest('.details-btn');
  if (detailsBtn) {
    const card = detailsBtn.closest('.card');
    if (!card) return;
    const title = (card.querySelector('h3')||{textContent:''}).textContent.trim();
    const price = (card.querySelector('.price')||{textContent:''}).textContent.trim();
    alert(`${title}\n\nالسعر: ${price}\n\nملاحظات إضافية يمكن وضعها هنا.`);
    return;
  }
});

// 3) فتح وغلق المودال
function openModalWithProduct(product) {
  if (!modal || !orderForm) return;
  modal.setAttribute('aria-hidden', 'false');
  modal.style.display = 'grid';
  modalProduct.textContent = `المنتج: ${product.title} — السعر: ${product.price}`;
  orderForm.dataset.productTitle = product.title;
  orderForm.dataset.productPrice = product.price;
  // قفل/إعادة ضبط الكمية
  const qty = document.getElementById('cust-qty');
  if (qty) qty.value = 1;
  setTimeout(()=> {
    const nameInput = document.getElementById('cust-name');
    if (nameInput) nameInput.focus();
  }, 80);
}

function closeModal() {
  if (!modal || !orderForm) return;
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
  orderForm.reset();
  delete orderForm.dataset.productTitle;
  delete orderForm.dataset.productPrice;
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalCancel) modalCancel.addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// 4) ارسال النموذج -> فتح واتساب مع رسالة جاهزة
if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('cust-name')||{}).value?.trim() || '';
    const phone = (document.getElementById('cust-phone')||{}).value?.trim() || '';
    const city = (document.getElementById('cust-city')||{}).value?.trim() || '';
    const address = (document.getElementById('cust-address')||{}).value?.trim() || '';
    const qty = (document.getElementById('cust-qty')||{}).value?.trim() || '';
    const notes = (document.getElementById('cust-notes')||{}).value?.trim() || '';
    const productTitle = orderForm.dataset.productTitle || '-';
    const productPrice = orderForm.dataset.productPrice || '-';

    if (!name || !phone || !city || !address || !qty) {
      alert('من فضلك املأ الحقول المطلوبة: الاسم، رقم التليفون، المدينة، العنوان، والكمية.');
      return;
    }

    // قم ببناء الرسالة كسلسلة ثم قم بترميزها كلها دفعة واحدة
    let message = 'طلب جديد من متجر تيتو كلاسيك\n';
    message += '-------------------------\n';
    message += `المنتج: ${productTitle}\n`;
    message += `الكمية: ${qty}\n`;
    message += `السعر (تقريبي): ${productPrice}\n`;
    message += '-------------------------\n';
    message += `الاسم: ${name}\n`;
    message += `رقم التليفون: ${phone}\n`;
    message += `المدينة/المنطقة: ${city}\n`;
    message += `العنوان: ${address}\n`;
    if (notes) message += `ملاحظات: ${notes}\n`;

    const encoded = encodeURIComponent(message);
    const phoneDigits = OWNER_NUMBER.replace(/\D/g, '');
    const waUrl = `${WA_BASE}${phoneDigits}?text=${encoded}`;

    window.open(waUrl, '_blank');
    alert('سيُفتح واتساب لإرسال الطلب — تأكد من الضغط على إرسال داخل واتساب.');
    closeModal();
  });
}
