import { buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { IoMenuSharp } from "react-icons/io5";
import Link from "./link";
import Logo from "../block/logo";

export function MobileDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>
        <IoMenuSharp className="text-2xl" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-6">
          <div className="">
            <Link
              to="/"
              title="brand-logo"
              className="relative mr-6 flex items-center space-x-2"
            >
              <Logo />
            </Link>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <Link
            to="#"
            className={cn(
              buttonVariants({ variant: "default" }),
              "text-white rounded-full group "
            )}
          >
            Đăng nhập
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
