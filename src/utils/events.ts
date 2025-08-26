type ToastType = "info" | "warning" | "error" | "success";

let toastFunction: ((message: string, type?: ToastType) => void) | null = null;
let redirectFunction: ((path: string) => void) | null = null;

export const setToastFunction = (
  fn: ((message: string, type?: ToastType) => void) | null, 
) => {
  toastFunction = fn;
};


export const setRedirectFunction = (
  fn: ((path: string) => void) | null 
) => {
  redirectFunction = fn;
};

export const showToast = (message: string, type: ToastType = "info") => {
  toastFunction?.(message, type);
};

export const redirectTo = (path: string) => {
  redirectFunction?.(path);
};
