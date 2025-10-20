import { QRCodeModal } from "@/components/ui/qr-code-modal";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export function QRCodeModalExample() {
  // Example usage with custom trigger
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">QR Code Modal Examples</h3>

      {/* Basic usage with default trigger */}
      <QRCodeModal linkId="your-link-id" />

      {/* Usage with custom trigger */}
      <QRCodeModal
        linkId="your-link-id"
        trigger={
          <Button variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            Tạo mã QR
          </Button>
        }
      />
    </div>
  );
}
