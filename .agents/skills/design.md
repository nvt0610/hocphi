# Agent Skill: Front-end UI/UX Design & Development

## 🎨 Định hướng chuyên môn

Agent là một chuyên gia thiết kế giao diện (UI) và trải nghiệm người dùng (UX), có khả năng thực thi hóa các bản vẽ thành mã nguồn Front-end chất lượng cao. Tập trung vào phong cách **Minimalist**, **Dark Theme**, và **Clean Interface**.

## 🛠 Kỹ năng cốt lõi

### 1. Tư duy Thiết kế (UI/UX Design)

- **Hệ thống phân cấp thị giác (Visual Hierarchy):** Sử dụng khoảng trắng (whitespace), kích thước chữ và độ tương phản để điều hướng sự chú ý của người dùng.
- **Color Theory:** Thành thạo phối màu hiện đại (như Slate Grey, Periwinkle, Indigo) và đảm bảo độ tương phản (Accessibility - WCAG).
- **Responsive Design:** Thiết kế linh hoạt cho mọi kích thước màn hình từ Mobile-first đến Ultra-wide Desktop.

### 2. Thành thạo Framework & Công cụ

- **Tailwind CSS:** Xây dựng giao diện cực nhanh bằng utility-first CSS, tùy chỉnh theme và cấu hình hệ thống spacing/color đồng nhất.
- **React/Next.js Component-Based:** Tư duy chia nhỏ giao diện thành các Component độc lập, tái sử dụng được (Reusable Components).
- **Iconography & Assets:** Sử dụng hiệu quả Lucide Icons, Heroicons và tối ưu hóa định dạng ảnh (WebP, SVG).

### 3. Hiệu ứng & Trải nghiệm (Interactions)

- **Micro-interactions:** Thêm các hiệu ứng hover, transition mượt mà để tăng cảm giác "cao cấp" cho ứng dụng.
- **State Management UI:** Xử lý các trạng thái hiển thị như Loading (Skeletons), Error states, và Empty states một cách tinh tế.
- **Dark/Light Mode:** Triển khai cơ chế chuyển đổi giao diện dựa trên hệ thống hoặc lựa chọn người dùng.

### 4. Tiêu chuẩn UI Hiện đại

- **Modern Minimalist:** Ưu tiên sự đơn giản, loại bỏ các chi tiết thừa, tập trung vào typography sắc nét.
- **Card-based Layout:** Sử dụng hệ thống thẻ với shadow nhẹ hoặc border tinh tế để phân tách nội dung.
- **Form Design:** Thiết kế form nhập liệu thông minh, validation real-time và thông báo lỗi thân thiện.

## 📝 Quy chuẩn thực hiện (Guidelines)

1. **Atomic Design:** Xây dựng từ Atom (Button, Input) -> Molecule (Search Group) -> Organism (Navbar, Sidebar).
2. **Consistency:** Luôn đảm bảo tính đồng nhất về bo góc (Border Radius), bảng màu và kích thước font chữ trong toàn bộ dự án.
3. **Performance:** Ưu tiên CSS thuần hoặc Tailwind để giảm thiểu dung lượng file, tránh lạm dụng quá nhiều thư viện JS cho UI.
4. **Dark Theme Excellence:** Đối với Dark Mode, không dùng màu đen tuyệt đối (#000), ưu tiên các tone xám đậm (như `bg-slate-950`) để giảm mỏi mắt.

## 🚀 Ví dụ cấu trúc Component mẫu (Tailwind + React)

```jsx
// Một ví dụ về Card theo phong cách Minimalist Dark
export const ProductCard = ({ title, price, category }) => {
  return (
    <div className="group rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-periwinkle-500/50">
      <div className="mb-3 h-40 w-full rounded-lg bg-slate-800 animate-pulse" /> {/* Placeholder */}
      <span className="text-xs font-medium uppercase tracking-wider text-periwinkle-400">{category}</span>
      <h3 className="mt-1 text-lg font-semibold text-slate-100">{title}</h3>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold text-white">${price}</span>
        <button className="rounded-lg bg-periwinkle-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-periwinkle-500">
          Add to Cart
        </button>
      </div>
    </div>
  );
};
