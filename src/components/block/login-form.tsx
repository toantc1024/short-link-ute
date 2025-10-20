const LoginForm = () => {
  return <div>LoginForm</div>;
};

export default LoginForm;

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   ChevronLeft,
//   ChevronRight,
//   EyeIcon,
//   EyeOffIcon,
//   Key,
//   MailIcon,
// } from "lucide-react";
// import { FcGoogle } from "react-icons/fc";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useEffect, useRef, useState } from "react";
// import { EMAIL_REGEX } from "@/constants/regex";
// import {
//   authWithEmail,
//   authWithPassword,
//   signInWithGoogle,
//   verifyOtp,
// } from "@/services/auth.service";
// import { useAuthFormStore } from "@/stores/auth-form.store";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
// import { Spinner } from "../ui/shadcn-io/spinner";
// import { AuroraText } from "../ui/aurora-text";
// import { useNotification } from "@/hooks/use-notification";
// import { supabase } from "@/lib/supabase";
// import { useAuthStore } from "../../stores/auth.store";
// import type { User } from "@supabase/supabase-js";

// const loginSchema = z.object({
//   email: z
//     .string()
//     .min(1, "Bạn chưa nhập email")
//     .regex(EMAIL_REGEX, "Email không hợp lệ"),
// });

// const passwordSchema = z.object({
//   email: z.string(),
//   password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
// });

// type LoginFormData = z.infer<typeof loginSchema>;
// type PasswordFormData = z.infer<typeof passwordSchema>;

// export function LoginForm({
//   className,
// }: React.HTMLAttributes<HTMLDivElement> & {}) {
//   // Use the notification hook inside the component
//   const notify = useNotification();

//   const {
//     email: currentEmail,
//     setEmail: setCurrentEmail,
//     otp,
//     setOtp,
//     otpCountdown,
//     setOpen,
//     currentStage,
//     setStage,
//     setOtpCountdown,
//   } = useAuthFormStore();

//   const [showPassword, setShowPassword] = useState(false);
//   const otpInputRef = useRef<HTMLDivElement>(null);

//   const form = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   const passwordForm = useForm<PasswordFormData>({
//     resolver: zodResolver(passwordSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   const onSubmit = async (_data: LoginFormData) => {
//     form.clearErrors();
//     try {
//       setIsLoading(true);
//       const response = await authWithEmail(_data.email);
//       if (response) {
//         setCurrentEmail(_data.email);
//         setStage("otp");
//         setOtpCountdown(60);
//         notify.success("Mã OTP đã được gửi đến email của bạn.");
//         setIsLoading(false);
//       }
//     } catch (error) {
//       setIsLoading(false);
//       notify.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
//     }
//   };
//   const { loadUserData } = useAuthStore();
//   const onLoginSuccess = async (currentUser: User) => {
//     await loadUserData(currentUser);
//     setOpen(false);
//     useAuthFormStore.getState().reset();
//   };
//   const onSubmitPassword = async (data: PasswordFormData) => {
//     try {
//       setIsLoading(true);
//       let currentUser = await authWithPassword(data.email, data.password);

//       if (currentUser) {
//         onLoginSuccess(currentUser);
//         notify.success("Đăng nhập thành công!");
//         setIsLoading(false);
//       }
//     } catch (error: any) {
//       setIsLoading(false);
//       if (error.message) {
//         notify.error(error.message);
//       } else {
//         notify.error("Đăng nhập thất bại. Vui lòng thử lại.");
//       }
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       if (otp.length === 6) {
//         const { data, error } = await supabase.auth.verifyOtp({
//           email: currentEmail,
//           token: otp,
//           type: "email",
//         });

//         if (error) {
//           notify.error("Mã OTP không hợp lệ. Vui lòng thử lại.");
//         } else {
//           onLoginSuccess(data.user!);
//         }
//       }
//     })();
//   }, [otp]);
//   const onError = () => {
//     const errors = form.formState.errors;
//     if (errors.email?.message) {
//       notify.error(errors.email.message);
//     }
//   };

//   const onPasswordError = () => {
//     const errors = passwordForm.formState.errors;
//     if (errors.password?.message) {
//       notify.error(errors.password.message);
//     }
//   };

//   if (currentStage === "input")
//     return (
//       <form
//         className={cn("flex p-2 flex-col gap-6", className)}
//         onSubmit={form.handleSubmit(onSubmit, onError)}
//       >
//         <div className="flex items-center text-center text-lg md:text-2xl justify-between">
//           <div className="flex items-center justify-center w-full pt-2 gap-2">
//             Trở thành một phần của <AuroraText>LiveHub</AuroraText>
//           </div>
//         </div>
//         <Button
//           variant="outline"
//           className="w-full rounded-3xl hover:text-black-500 cursor-pointer"
//           type="button"
//           onClick={async () => {
//             await signInWithGoogle();
//           }}
//         >
//           <FcGoogle />
//           Đăng nhập bằng Google
//         </Button>
//         <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
//           <span className="text-muted-foreground bg-background relative z-10 px-2">
//             Hoặc tiếp tục bằng
//           </span>
//         </div>
//         <div className="grid gap-6">
//           <div className="grid w-full max-w-sm items-center gap-3 relative">
//             <Label htmlFor="email-icon" className="hidden">
//               Email
//             </Label>

//             <div className="relative">
//               <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-all duration-200 ease-in-out" />
//               <Input
//                 id="email-icon"
//                 placeholder="Nhập email"
//                 className="pl-10 rounded-3xl"
//                 {...form.register("email")}
//               />
//             </div>
//           </div>
//           <div className="flex flex-col gap-2">
//             {isLoading ? (
//               <Button type="submit" disabled className=" rounded-3xl w-full">
//                 <Spinner />
//               </Button>
//             ) : (
//               <Button
//                 type="submit"
//                 className="cursor-pointer rounded-3xl w-full"
//               >
//                 <p>Tiếp tục</p>
//                 <ChevronRight />
//               </Button>
//             )}
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => {
//                 setStage("password");
//                 passwordForm.setValue("email", form.getValues("email"));
//               }}
//               className="cursor-pointer rounded-3xl w-full"
//             >
//               <p className=" text-primary">Nhập mật khẩu</p>
//               <Key className=" text-primary" />
//             </Button>
//           </div>
//         </div>
//       </form>
//     );

//   if (currentStage === "password")
//     return (
//       <form
//         className={cn("flex p-2 flex-col gap-6", className)}
//         onSubmit={passwordForm.handleSubmit(onSubmitPassword, onPasswordError)}
//       >
//         <div className="flex items-center text-center justify-between">
//           <h3 className="text-lg font-semibold w-full">Đăng nhập</h3>
//           <div className="w-8"></div>
//         </div>

//         <div className="grid gap-6">
//           <div className="grid w-full max-w-sm items-center gap-3 relative">
//             <Label htmlFor="email" className="hidden">
//               Email
//             </Label>

//             <div className="relative">
//               <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-all duration-200 ease-in-out" />
//               <Input
//                 id="email"
//                 {...passwordForm.register("email")}
//                 placeholder="Nhập email"
//                 className="pl-10 rounded-3xl"
//               />
//             </div>
//           </div>

//           <div className="grid w-full max-w-sm items-center gap-3 relative">
//             <Label htmlFor="password" className="hidden">
//               Mật khẩu
//             </Label>

//             <div className="relative">
//               <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-all duration-200 ease-in-out" />
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Nhập mật khẩu"
//                 className="pl-10 pr-10 rounded-3xl"
//                 {...passwordForm.register("password")}
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className="absolute right-0 top-0 h-full px-3 py-2"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
//                 ) : (
//                   <EyeIcon className="h-4 w-4 text-muted-foreground" />
//                 )}
//                 <span className="sr-only">
//                   {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
//                 </span>
//               </Button>
//             </div>
//           </div>

//           <Button
//             type="submit"
//             className="cursor-pointer rounded-3xl w-full"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <Spinner />
//             ) : (
//               <>
//                 <p>Đăng nhập</p>
//                 <ChevronRight />
//               </>
//             )}
//           </Button>
//         </div>
//       </form>
//     );

//   // OTP Stage
//   return (
//     <div className="flex flex-col gap-6 p-2">
//       <div className="flex items-center text-center justify-between">
//         <h3 className="text-lg font-semibold w-full">Nhập mã</h3>
//         <div className="w-8"></div>
//       </div>
//       <p className="text-center text-muted-foreground text-sm mb-4">
//         Vui lòng nhập mã 6 chữ số chúng tôi đã gửi đến <b>{currentEmail}</b>
//       </p>
//       <div className="flex justify-center" ref={otpInputRef}>
//         <InputOTP
//           maxLength={6}
//           value={otp}
//           onChange={setOtp}
//           autoFocus={otp.length < 6}
//         >
//           <InputOTPGroup className="space-x-2">
//             <InputOTPSlot
//               index={0}
//               className="bg-background  rounded-md border-l border-border shadow-none font-semibold"
//             />
//             <InputOTPSlot
//               index={1}
//               className="bg-background rounded-md border-l border-border shadow-none font-semibold"
//             />
//             <InputOTPSlot
//               index={2}
//               className="bg-background rounded-md border-l border-border shadow-none font-semibold"
//             />
//             <InputOTPSlot
//               index={3}
//               className="bg-background rounded-md border-l border-border shadow-none font-semibold"
//             />
//             <InputOTPSlot
//               index={4}
//               className="bg-background rounded-md border-l border-border shadow-none font-semibold"
//             />
//             <InputOTPSlot
//               index={5}
//               className="bg-background rounded-md border-l border-border shadow-none font-semibold"
//             />
//           </InputOTPGroup>
//         </InputOTP>
//       </div>

//       <div className="flex justify-between items-center gap-3">
//         <Button type="button" onClick={() => {}} className="rounded-3xl">
//           Dán mã
//         </Button>

//         <div>
//           {otpCountdown === 0 ? (
//             <Button
//               variant="link"
//               className="p-0"
//               onClick={() => {
//                 onSubmit({ email: currentEmail });
//               }}
//             >
//               {isLoading ? <Spinner size="lg" /> : <>Gửi lại mã</>}
//             </Button>
//           ) : (
//             <>Gửi lại mã {otpCountdown > 0 && `(${otpCountdown}s)`}</>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
