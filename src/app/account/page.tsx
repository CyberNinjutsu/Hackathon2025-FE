"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Bell,
  Wallet,
  Eye,
  EyeOff,
  Camera,
  Save,
  Smartphone,
  Mail,
  Globe,
  TrendingUp,
  DollarSign,
  ArrowLeft,
} from "lucide-react";

export default function AccountPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+84 123 456 789",
    bio: "Người đam mê blockchain và đầu tư tiền điện tử với hơn 5 năm kinh nghiệm trong quản lý tài sản số.",
    country: "Việt Nam",
    timezone: "UTC+7 (ICT)",
  });
  const router = useRouter();
  const handleSaveProfile = () => {
    setIsEditing(false);
    // Xử lý logic lưu tại đây
  };
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }

  function getColorFromName(name: string) {
    const index = hashString(name) % colors.length;
    return colors[index];
  }

  function getInitials(name: string, locale: "vn" | "en" = "vn") {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";

    if (locale === "vn") {
      // Vietnamese: commonly last two tokens are middle + given name
      if (parts.length >= 2) {
        const a = parts[parts.length - 2][0];
        const b = parts[parts.length - 1][0];
        return (a + b).toUpperCase();
      }
      return parts[parts.length - 1][0].toUpperCase();
    } else {
      // English: first and last name
      if (parts.length >= 2) {
        const a = parts[0][0];
        const b = parts[parts.length - 1][0];
        return (a + b).toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-foreground relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          className="glass-button text-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%239C92AC%22 fillOpacity%3D%220.05%22%3E%3Ccircle cx%3D%2230%22 cy%3D%2230%22 r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />

      <div className="relative container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Cài Đặt Tài Khoản
              </h1>
              <p className="text-blue-100 text-lg">
                Quản lý thông tin tài khoản và tùy chỉnh cá nhân với phong cách
                hiện đại
              </p>
            </div>

            <div className="flex gap-4">
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Tổng Tài Sản</p>
                      <p className="text-xl font-bold text-white">$24,580</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <DollarSign className="h-5 w-5 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Lợi Nhuận 24h</p>
                      <p className="text-xl font-bold text-green-300">
                        +$1,240
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-blue-800/50 backdrop-blur-sm border border-blue-600/30">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 text-blue-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <User className="h-4 w-4" />
              Hồ Sơ
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 text-blue-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4" />
              Bảo Mật
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2 text-blue-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Bell className="h-4 w-4" />
              Thông Báo
            </TabsTrigger>
            <TabsTrigger
              value="wallets"
              className="flex items-center gap-2 text-blue-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Wallet className="h-4 w-4" />
              Ví Tiền
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="border-b border-blue-600/30">
                <CardTitle className="flex items-center justify-between text-2xl text-white">
                  Thông Tin Cá Nhân
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={
                      isEditing ? handleSaveProfile : () => setIsEditing(true)
                    }
                    className={
                      isEditing
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-blue-400 text-white hover:bg-blue-700/50"
                    }
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu Thay Đổi
                      </>
                    ) : (
                      "Chỉnh Sửa Hồ Sơ"
                    )}
                  </Button>
                </CardTitle>
                <CardDescription className="text-base text-blue-200">
                  Cập nhật thông tin cá nhân và chi tiết hồ sơ của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 ring-4 ring-purple-500/30">
                    <AvatarImage
                      src=""
                      alt={profileData.firstName + " " + profileData.lastName}
                    />
                    <AvatarFallback
                      className={`text-lg text-white ${getColorFromName(
                        profileData.firstName + " " + profileData.lastName
                      )}`}
                    >
                      {getInitials(
                        profileData.firstName + " " + profileData.lastName,
                        "vn"
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-700/50 border-blue-400 text-blue-100 hover:bg-blue-600/50"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Đổi Ảnh
                    </Button>
                    <p className="text-sm text-blue-300">
                      JPG, PNG hoặc GIF. Dung lượng tối đa 2MB.
                    </p>
                  </div>
                </div>

                <Separator className="bg-blue-600/30" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="font-medium text-blue-100"
                    >
                      Họ
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="glass-input text-white placeholder:text-blue-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="font-medium text-blue-100"
                    >
                      Tên
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="glass-input text-white placeholder:text-blue-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="font-medium text-blue-100"
                    >
                      Địa Chỉ Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="glass-input text-white placeholder:text-blue-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="font-medium text-blue-100"
                    >
                      Số Điện Thoại
                    </Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="glass-input text-white placeholder:text-blue-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="font-medium text-blue-100"
                    >
                      Quốc Gia
                    </Label>
                    <Select
                      value={profileData.country}
                      onValueChange={(value) => {
                        if (isEditing) {
                          setProfileData({ ...profileData, country: value });
                        }
                      }}
                      disabled={!isEditing}
                    >
                      <SelectTrigger
                        id="country"
                        aria-label="Quốc Gia"
                        className="glass-input text-white placeholder:text-blue-300"
                      >
                        <SelectValue placeholder="Chọn quốc gia" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-blue-600/30 text-blue-100">
                        <SelectItem value="Việt Nam">Việt Nam</SelectItem>
                        <SelectItem value="United States">Hoa Kỳ</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">
                          Vương Quốc Anh
                        </SelectItem>
                        <SelectItem value="Germany">Đức</SelectItem>
                        <SelectItem value="France">Pháp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="timezone"
                      className="font-medium text-blue-100"
                    >
                      Múi Giờ
                    </Label>
                    <Select
                      value={profileData.timezone}
                      disabled={!isEditing}
                      onValueChange={(value) => {
                        if (isEditing) {
                          setProfileData({ ...profileData, timezone: value });
                        }
                      }}
                    >
                      <SelectTrigger
                        id="timezone"
                        aria-label="Múi Giờ"
                        className="glass-input text-white placeholder:text-blue-300"
                      >
                        <SelectValue placeholder="Chọn múi giờ" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-blue-600/30 text-blue-100">
                        <SelectItem value="UTC+7 (ICT)">UTC+7 (ICT)</SelectItem>
                        <SelectItem value="UTC-5 (EST)">UTC-5 (EST)</SelectItem>
                        <SelectItem value="UTC-8 (PST)">UTC-8 (PST)</SelectItem>
                        <SelectItem value="UTC+0 (GMT)">UTC+0 (GMT)</SelectItem>
                        <SelectItem value="UTC+1 (CET)">UTC+1 (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="font-medium text-blue-100">
                    Tiểu Sử
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Hãy kể về bản thân bạn..."
                    className="glass-input text-white placeholder:text-blue-300 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="border-b border-blue-600/30">
                <CardTitle className="text-2xl text-white">
                  Mật Khẩu & Xác Thực
                </CardTitle>
                <CardDescription className="text-base text-blue-200">
                  Quản lý mật khẩu và cài đặt bảo mật của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="font-medium text-blue-100"
                    >
                      Mật Khẩu Hiện Tại
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="glass-input text-white placeholder:text-blue-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-blue-100"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        aria-pressed={showCurrentPassword}
                        aria-label={
                          showCurrentPassword
                            ? "Ẩn mật khẩu hiện tại"
                            : "Hiện mật khẩu hiện tại"
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="font-medium text-blue-100"
                    >
                      Mật Khẩu Mới
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới"
                        className="glass-input text-white placeholder:text-blue-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-blue-100"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-pressed={showNewPassword}
                        aria-label={
                          showNewPassword
                            ? "Ẩn mật khẩu mới"
                            : "Hiện mật khẩu mới"
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="font-medium text-blue-100"
                    >
                      Xác Nhận Mật Khẩu Mới
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      className="glass-input text-white placeholder:text-blue-300"
                    />
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Cập Nhật Mật Khẩu
                  </Button>
                </div>

                <Separator className="bg-blue-600/30" />

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    Xác Thực Hai Yếu Tố
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-white" />
                        <span className="text-sm font-medium text-blue-100">
                          Ứng Dụng Xác Thực
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-purple-600/20 text-green-300 border-green-400"
                        >
                          Đã Bật
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-300">
                        Sử dụng ứng dụng xác thực để tạo mã xác minh
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-300" />
                        <span className="text-sm font-medium text-blue-100">
                          Xác Minh Email
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-purple-600/20 text-white/60 border-white/30"
                        >
                          Đã Tắt
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-300">
                        Nhận mã xác minh qua email
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator className="bg-blue-600/30" />

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    Phiên Hoạt Động
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-900/50 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-white" />
                          <span className="text-sm font-medium text-blue-100">
                            Chrome trên Windows
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-purple-600/20 text-blue-300 border-blue-400"
                          >
                            Hiện Tại
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-300">
                          Hồ Chí Minh, VN • Hoạt động lần cuối: hiện tại
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-900/50 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-blue-300" />
                          <span className="text-sm font-medium text-blue-100">
                            Ứng Dụng Di Động
                          </span>
                        </div>
                        <p className="text-sm text-blue-300">
                          Hồ Chí Minh, VN • Hoạt động lần cuối: 2 giờ trước
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-700/50 border-blue-400 text-blue-100 hover:bg-blue-600/50"
                      >
                        Thu Hồi
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="border-b border-blue-600/30">
                <CardTitle className="text-2xl text-white">
                  Tùy Chọn Thông Báo
                </CardTitle>
                <CardDescription className="text-base text-blue-200">
                  Chọn cách bạn muốn nhận thông báo về hoạt động tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    Thông Báo Email
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-blue-100">
                          Cập Nhật Danh Mục Đầu Tư
                        </span>
                        <p className="text-sm text-blue-300">
                          Tóm tắt hàng ngày về hiệu suất danh mục của bạn
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-blue-100">
                          Cảnh Báo Giao Dịch
                        </span>
                        <p className="text-sm text-blue-300">
                          Thông báo cho các giao dịch gửi và nhận
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-blue-100">
                          Cảnh Báo Bảo Mật
                        </span>
                        <p className="text-sm text-blue-300">
                          Thông báo bảo mật quan trọng và cảnh báo đăng nhập
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-blue-100">
                          Cập Nhật Marketing
                        </span>
                        <p className="text-sm text-blue-300">
                          Cập nhật sản phẩm và nội dung khuyến mại
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator className="bg-blue-600/30" />

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    Thông Báo Đẩy
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-blue-100">
                          Cảnh Báo Giá
                        </span>
                        <p className="text-sm text-blue-300">
                          Thông báo khi tài sản của bạn đạt mức giá mục tiêu
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-blue-100">
                          Giao Dịch Lớn
                        </span>
                        <p className="text-sm text-blue-300">
                          Cảnh báo cho giao dịch trên $1,000
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallets" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="border-b border-blue-600/30">
                <CardTitle className="text-2xl text-white">
                  Ví Đã Kết Nối
                </CardTitle>
                <CardDescription className="text-base text-blue-200">
                  Quản lý các ví tiền điện tử đã kết nối của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-900/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-white" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-100">
                            Ví MetaMask
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-purple-600/20 text-blue-300 border-blue-400"
                          >
                            Chính
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-300">
                          0x742d...4c2f • Kết nối 3 tháng trước
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-700/50 border-blue-400 text-blue-100 hover:bg-blue-600/50"
                    >
                      Quản Lý
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-900/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-white" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-blue-100">
                          Ví Coinbase
                        </span>
                        <p className="text-sm text-blue-300">
                          0x8a3b...7e9d • Kết nối 1 tháng trước
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-700/50 border-blue-400 text-blue-100 hover:bg-blue-600/50"
                    >
                      Quản Lý
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-blue-700/50 border-blue-400 text-blue-100 hover:bg-blue-600/50"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Kết Nối Ví Mới
                  </Button>
                </div>

                <Separator className="bg-blue-600/30" />

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    Tùy Chọn Ví
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-blue-100">
                          Tự Động Đồng Bộ Số Dư
                        </span>
                        <p className="text-sm text-blue-300">
                          Tự động cập nhật số dư ví mỗi 5 phút
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-blue-100">
                          Ẩn Số Dư Nhỏ
                        </span>
                        <p className="text-sm text-blue-300">
                          Ẩn tài sản có giá trị dưới $1
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
