const AuthDialog = () => {
  return <div>AuthDialog</div>;
};

export default AuthDialog;

// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import { LoginForm } from "./login-form";
// import { useAuthFormStore } from "@/stores/auth-form.store";
// import DialogBlock from "./dialog-block";
// import { useAuthStore } from "@/stores/auth.store";
// import { Avatar } from "../ui/avatar";
// import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { useNavigate } from "react-router-dom";
// import { Sun, User } from "lucide-react";
// export default function DrawerDialogDemo() {
//   const { currentStage, setOtp, reset, open, setOpen } = useAuthFormStore();

//   useEffect(() => {
//     if (open && currentStage !== "otp") {
//       setOtp("");
//       useAuthFormStore.getState().setStage("input");
//     }
//   }, [open]);
//   const { user } = useAuthStore();
//   const navigate = useNavigate();

//   return (
//     <>
//       {/* {user && (
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={() => navigate("/u/" + user.id)}
//           className="cursor-pointer rounded-full h-8 w-8 hidden md:block"
//         >
//           <Avatar>
//             <AvatarImage
//               src={user.user_metadata.avatar_url}
//               alt={user.user_metadata.full_name}
//             />
//             <AvatarFallback className="flex items-center justify-center w-full">
//               <User className="h-8 w-8 rotate-0 scale-100 transition-all text-primary" />
//             </AvatarFallback>
//           </Avatar>
//         </Button>
//       )} */}

//       <DialogBlock
//         open={open}
//         showPrevious={currentStage !== "input"}
//         showCloseButton={currentStage === "input"}
//         onPreviousHandler={() => {
//           if (currentStage === "otp" || currentStage === "password") {
//             useAuthFormStore.getState().setStage("input");
//             reset();
//           }
//         }}
//         onOpenChange={setOpen}
//         trigger={
//           <div>
//             {!user && (
//               <Button
//                 onClick={() => {
//                   setOpen(true);
//                 }}
//                 className="bg-secondary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-secondary-foreground w-32 px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95"
//                 variant="outline"
//               >
//                 Đăng nhập
//               </Button>
//             )}
//           </div>
//         }
//         content={<LoginForm />}
//         className=""
//       />
//     </>
//   );
// }
