"use client";

import * as React from "react";
import { MoreHorizontal, Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Link } from "@/types/link.type";
import { useLinkStore } from "@/stores/link.store";
import { useAuthStore } from "@/stores/auth.store";
import { isValidUrl, isValidShortCode, normalizeUrl } from "@/lib/utils";

interface LinkActionsModalProps {
  link: Link;
  trigger?: React.ReactNode;
}

export function LinkActionsModal({ link, trigger }: LinkActionsModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    original_url: link.original_url,
    short_code: link.short_code || "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const { removeLink, updateLink } = useLinkStore();
  const { user_profile } = useAuthStore();
  const isAnonymous = user_profile?.role === "anonymous";

  const handleEdit = async () => {
    if (isAnonymous) return;

    // Validation
    const normalizedUrl = normalizeUrl(editForm.original_url.trim());
    if (!isValidUrl(normalizedUrl)) {
      console.error("Invalid URL");
      return;
    }

    if (!isValidShortCode(editForm.short_code.trim())) {
      console.error("Invalid short code");
      return;
    }

    setIsLoading(true);
    try {
      await updateLink(link.id, {
        original_url: normalizedUrl,
        short_code: editForm.short_code.trim(),
      });
      setIsOpen(false);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error updating link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isAnonymous) return;

    setIsLoading(true);
    try {
      await removeLink(link.id);
      setIsOpen(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModals = () => {
    setShowDeleteConfirm(false);
    setShowEditForm(false);
    setEditForm({
      original_url: link.original_url,
      short_code: link.short_code || "",
    });
  };

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger || (
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setIsOpen(false);
              resetModals();
            }}
          />

          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {showDeleteConfirm
                  ? "Xác nhận xóa"
                  : showEditForm
                  ? "Chỉnh sửa liên kết"
                  : "Hành động"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  resetModals();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-4">
              {isAnonymous ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    Bạn cần đăng nhập để có thể chỉnh sửa hoặc xóa liên kết.
                  </p>
                  <Button onClick={() => setIsOpen(false)}>Đăng nhập</Button>
                </div>
              ) : showDeleteConfirm ? (
                <div className="text-center">
                  <p className="mb-4">
                    Bạn có chắc chắn muốn xóa liên kết này không?
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {link.original_url}
                  </p>
                </div>
              ) : showEditForm ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="original_url">Liên kết gốc</Label>
                    <Input
                      id="original_url"
                      value={editForm.original_url}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          original_url: e.target.value,
                        }))
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="short_code">Mã rút gọn</Label>
                    <Input
                      id="short_code"
                      value={editForm.short_code}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          short_code: e.target.value,
                        }))
                      }
                      placeholder="my-link"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setShowEditForm(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-4 border-t">
              {showDeleteConfirm ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang xóa..." : "Xóa"}
                  </Button>
                </>
              ) : showEditForm ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditForm(false)}
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleEdit}
                    disabled={isLoading || !editForm.original_url.trim()}
                  >
                    {isLoading ? "Đang lưu..." : "Lưu"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsOpen(false)}>Đóng</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
