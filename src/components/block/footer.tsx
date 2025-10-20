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
      <div className="grow" />
      <footer className="border-t  ">
        <div className="">
          <div className="py-6 flex flex-col justify-start items-center">
            {/* Logo */}
            <div className="w-full flex justify-center">
              <Logo className="h-14 w-auto" />
            </div>
            {/* 
            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    to={href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul> */}
          </div>
          <div className="pb-4 pt-0 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-4">
            {/* Copyright */}
            <span className="text-center w-full text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Thực hiện bởi Phòng Truyền Thông - Trường Đại học Sư phạm Kỹ thuật
              TP. Hồ Chí Minh
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
