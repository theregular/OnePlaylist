"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-foreground group-[.toaster]:border-3 group-[.toaster]:shadow-[6px_6px_0_var(--foreground)] group-[.toaster]:rounded-none group-[.toaster]:font-bold group-[.toaster]:tracking-wide",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:font-semibold group-[.toast]:tracking-wide",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:border-2 group-[.toast]:border-foreground group-[.toast]:rounded-none group-[.toast]:font-black group-[.toast]:uppercase group-[.toast]:tracking-wider group-[.toast]:shadow-[2px_2px_0_var(--foreground)] hover:group-[.toast]:-translate-y-0.5 hover:group-[.toast]:shadow-[4px_4px_0_var(--foreground)]",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:border-2 group-[.toast]:border-foreground group-[.toast]:rounded-none group-[.toast]:font-black group-[.toast]:uppercase group-[.toast]:tracking-wider",
          success:
            "group-[.toaster]:border-green-500 group-[.toaster]:bg-green-50 dark:group-[.toaster]:bg-green-950",
          error:
            "group-[.toaster]:border-red-500 group-[.toaster]:bg-red-50 dark:group-[.toaster]:bg-red-950",
          info: "group-[.toaster]:border-blue-500 group-[.toaster]:bg-blue-50 dark:group-[.toaster]:bg-blue-950",
          warning:
            "group-[.toaster]:border-yellow-500 group-[.toaster]:bg-yellow-50 dark:group-[.toaster]:bg-yellow-950",
          title:
            "group-[.toast]:font-black group-[.toast]:uppercase group-[.toast]:tracking-widest group-[.toast]:text-sm",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
