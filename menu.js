// ================================================
// DRAWER - Mở/đóng menu mobile
// ================================================

// Hàm toggle drawer: thêm/xóa class 'drawer-open' trên body
// CSS sẽ tự xử lý animation khi class này thay đổi
function toggleDrawer() {
    document.body.classList.toggle('drawer-open');
}


// ================================================
// CATEGORY NAV - Highlight link đang active
// ================================================

const navLinks = document.querySelectorAll('body > nav a');
const sections = document.querySelectorAll('section[id]');

// Click vào link: bỏ active tất cả, đặt active cho link vừa bấm
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Map section con → section cha trên category nav
// Ví dụ: khi scroll đến #ga thì highlight "Món chính" (#com)
const sectionParentMap = {
    'ga':     'com',   // Gà thuộc Món chính
    'burger': 'com',   // Burger thuộc Món chính
    'mi-y':   'mi-y',  // Mỳ ý thuộc Khác
    'pizza':  'mi-y',  // Pizza thuộc Khác
    'hotdog': 'mi-y'   // Hotdog thuộc Khác
};

// Scroll: tự động highlight link tương ứng với section đang hiển thị
window.addEventListener('scroll', () => {
    let current = '';

    // Tìm section nào đang hiện trên màn hình (dựa theo vị trí scroll)
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150; // trừ 150px cho fixed navbar
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    // Nếu section hiện tại là con (vd: ga, burger) thì đổi sang id cha (com)
    if (sectionParentMap[current]) {
        current = sectionParentMap[current];
    }

    // Bỏ active tất cả, rồi active link khớp với section hiện tại
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});


// ================================================
// TÌM KIẾM - Lọc sản phẩm theo từ khóa
// ================================================

function setupSearch() {
    // Lấy cả 2 ô input: trên navbar desktop và trong drawer mobile
    const inputs = document.querySelectorAll('.navbar-search input, .drawer-search input');

    inputs.forEach(input => {
        input.addEventListener('input', function () {
            const keyword = this.value.trim().toLowerCase();

            // Đồng bộ nội dung giữa 2 ô tìm kiếm
            inputs.forEach(i => { if (i !== this) i.value = this.value; });

            const sections = document.querySelectorAll('section');

            // Duyệt từng section, ẩn/hiện card sản phẩm theo từ khóa
            sections.forEach(section => {
                const cards = section.querySelectorAll('.product-card');
                let hasVisible = false;

                cards.forEach(card => {
                    const text = card.innerText.toLowerCase();

                    if (!keyword || text.includes(keyword)) {
                        // Hiện card nếu khớp từ khóa (hoặc ô tìm kiếm trống)
                        card.style.display = '';
                        hasVisible = true;
                    } else {
                        // Ẩn card không khớp
                        card.style.display = 'none';
                    }
                });

                // Ẩn cả section nếu không có card nào khớp
                section.style.display = hasVisible || !keyword ? '' : 'none';
            });

            // Kiểm tra toàn bộ section có bị ẩn hết không
            const allHidden = [...document.querySelectorAll('section')].every(s => s.style.display === 'none');

            // Tạo thông báo "Không tìm thấy" nếu chưa có, rồi ẩn/hiện tùy kết quả
            let noResult = document.getElementById('no-result');
            if (!noResult) {
                noResult = document.createElement('p');
                noResult.id = 'no-result';
                noResult.textContent = 'Không tìm thấy món ăn phù hợp.';
                noResult.style.cssText = 'text-align:center; color:#aaa; font-size:18px; margin:60px auto;';
                // Chèn thông báo vào trước footer
                document.querySelector('footer').insertAdjacentElement('beforebegin', noResult);
            }

            noResult.style.display = allHidden ? 'block' : 'none';
        });
    });
}

// Khởi chạy chức năng tìm kiếm
setupSearch();
// ================================================
// DROPDOWN MOBILE - Toggle bằng tap thay vì hover
// ================================================

document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', function (e) {
        if (window.innerWidth > 900) return;

        e.preventDefault();
        const dropdown = this.parentElement.querySelector('.dropdown');
        const isOpen = dropdown.style.display === 'block';

        document.querySelectorAll('.has-dropdown .dropdown').forEach(d => {
            d.style.display = 'none';
        });

        dropdown.style.display = isOpen ? 'none' : 'block';
    });
});

document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
        document.querySelectorAll('.has-dropdown .dropdown').forEach(d => {
            d.style.display = 'none';
        });
    }
});
