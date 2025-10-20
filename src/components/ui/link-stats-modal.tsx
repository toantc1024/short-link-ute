"use client";

import * as React from "react";
import { X, BarChart3, Eye, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { getLinkById } from "@/services/link.service";
import type { Link } from "@/types/link.type";
import { formatClickCount } from "@/lib/utils";

interface LinkStatsModalProps {
  linkId: string;
  trigger?: React.ReactNode;
}

export function LinkStatsModal({ linkId, trigger }: LinkStatsModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [link, setLink] = React.useState<Link | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchLinkData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const linkData = await getLinkById(linkId);
      setLink(linkData);
    } catch (err) {
      console.error("Error fetching link data:", err);
      setError("Không thể tải dữ liệu liên kết");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchLinkData();
  };

  const handleClose = () => {
    setIsOpen(false);
    setLink(null);
    setError(null);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Chưa có";
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Trigger */}
      <div onClick={handleOpen} className="cursor-pointer">
        {trigger || (
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-1" />
            Xem thống kê
          </Button>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-lg bg-background rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Thống kê liên kết
              </h2>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Spinner
                    variant="ellipsis"
                    className="h-12 w-12 text-primary mb-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Đang tải thống kê...
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : link ? (
                <div className="space-y-6">
                  {/* Link Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Thông tin liên kết</h3>
                    <div className="text-sm text-muted-foreground break-all">
                      <strong>URL gốc:</strong> {link.original_url}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Mã rút gọn:</strong>{" "}
                      <span className="font-mono">{link.short_code}</span>
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Lượt xem
                          </p>
                          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            {formatClickCount(link.click_count || 0)}
                          </p>
                        </div>
                        <Eye className="h-8 w-8 text-blue-500" />
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">
                            Trạng thái
                          </p>
                          <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                            {link.is_active ? "Hoạt động" : "Không hoạt động"}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Thời gian
                    </h3>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày tạo:</span>
                        <span className="font-medium">
                          {formatDate(link.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Cập nhật lần cuối:
                        </span>
                        <span className="font-medium">
                          {formatDate(link.updated_at)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Lần xem cuối:
                        </span>
                        <span className="font-medium">
                          {formatDate(link.last_clicked_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 border-t">
              <Button onClick={handleClose}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
