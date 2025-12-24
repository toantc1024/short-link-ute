import Logo from "../ui/logo";
// import Link from "../ui/link";

// const footerLinks = [
//   {
//     title: "Về chúng tôi",
//     href: "#",
//   },
//   {
//     title: "Liên hệ",
//     href: "#",
//   },
//   {
//     title: "Hỗ trợ",
//     href: "#",
//   },
// ];

const Footer = () => {
  return (
    <div className="flex flex-col">
      <footer className="border-t w-full">
        <div className="w-full max-w-6xl mx-auto">
          <div className="py-6 flex flex-col justify-start items-center">
            {/* Logo */}
            <div className="w-full flex justify-center">
              <Logo className="h-14 w-auto" />
            </div>
          </div>
          <div className="pt-0 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 px-4 sm:px-6 xl:px-4 w-full">
            <span className="text-center w-full text-muted-foreground text-xs sm:text-sm leading-relaxed whitespace-nowrap overflow-x-auto">
              Thực hiện bởi Phòng Quản trị Thương hiệu & Truyền thông Trường Đại
              học Sư phạm Kỹ thuật TP. Hồ Chí Minh
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
