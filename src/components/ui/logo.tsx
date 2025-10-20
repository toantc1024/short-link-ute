import LOGO from "@/assets/logo/square_logo.png";

const Logo = ({ className }: { className?: string }) => {
  return <img src={LOGO} className={className} alt="Logo" />;
};

export default Logo;
