import { toast, type ExternalToast } from "sonner";

export class Toast {
  static error(message: string, data?: ExternalToast) {
    const partData: ExternalToast = {className: "border! border-destructive!"};
    const newData = Object.assign(data ?? {}, partData);
    return toast.error(message, newData);
  }
}
