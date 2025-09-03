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

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Xử lý logic lưu tại đây
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Cài Đặt Tài Khoản
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin tài khoản và tùy chỉnh cá nhân
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Hồ Sơ
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Bảo Mật
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Thông Báo
            </TabsTrigger>
            <TabsTrigger value="wallets" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Ví Tiền
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Thông Tin Cá Nhân
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={
                      isEditing ? handleSaveProfile : () => setIsEditing(true)
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
                <CardDescription>
                  Cập nhật thông tin cá nhân và chi tiết hồ sơ của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/professional-profile.png" />
                    <AvatarFallback className="text-lg">MN</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Đổi Ảnh
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG hoặc GIF. Dung lượng tối đa 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Địa Chỉ Email</Label>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số Điện Thoại</Label>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Quốc Gia</Label>
                    <Select value={profileData.country} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                    <Label htmlFor="timezone">Múi Giờ</Label>
                    <Select value={profileData.timezone} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                  <Label htmlFor="bio">Tiểu Sử</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Hãy kể về bản thân bạn..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mật Khẩu & Xác Thực</CardTitle>
                <CardDescription>
                  Quản lý mật khẩu và cài đặt bảo mật của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mật Khẩu Hiện Tại</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
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
                    <Label htmlFor="newPassword">Mật Khẩu Mới</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
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
                    <Label htmlFor="confirmPassword">
                      Xác Nhận Mật Khẩu Mới
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                    />
                  </div>
                  <Button>Cập Nhật Mật Khẩu</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Xác Thực Hai Yếu Tố</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Ứng Dụng Xác Thực
                        </span>
                        <Badge variant="secondary">Đã Bật</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sử dụng ứng dụng xác thực để tạo mã xác minh
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Xác Minh Email
                        </span>
                        <Badge variant="outline">Đã Tắt</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Nhận mã xác minh qua email
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Phiên Hoạt Động</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Chrome trên Windows
                          </span>
                          <Badge variant="secondary">Hiện Tại</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Hồ Chí Minh, VN • Hoạt động lần cuối: hiện tại
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Ứng Dụng Di Động
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Hồ Chí Minh, VN • Hoạt động lần cuối: 2 giờ trước
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Thu Hồi
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tùy Chọn Thông Báo</CardTitle>
                <CardDescription>
                  Chọn cách bạn muốn nhận thông báo về hoạt động tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Thông Báo Email</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium">
                          Cập Nhật Danh Mục Đầu Tư
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Tóm tắt hàng ngày về hiệu suất danh mục của bạn
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium">
                          Cảnh Báo Giao Dịch
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Thông báo cho các giao dịch gửi và nhận
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium">
                          Cảnh Báo Bảo Mật
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Thông báo bảo mật quan trọng và cảnh báo đăng nhập
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium">
                          Cập Nhật Marketing
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Cập nhật sản phẩm và nội dung khuyến mại
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Thông Báo Đẩy</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium">
                          Cảnh Báo Giá
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Thông báo khi tài sản của bạn đạt mức giá mục tiêu
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium">
                          Giao Dịch Lớn
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Cảnh báo cho giao dịch trên $1,000
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ví Đã Kết Nối</CardTitle>
                <CardDescription>
                  Quản lý các ví tiền điện tử đã kết nối của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Ví MetaMask</span>
                          <Badge variant="secondary">Chính</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          0x742d...4c2f • Kết nối 3 tháng trước
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Quản Lý
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium">Ví Coinbase</span>
                        <p className="text-sm text-muted-foreground">
                          0x8a3b...7e9d • Kết nối 1 tháng trước
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Quản Lý
                    </Button>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Wallet className="h-4 w-4 mr-2" />
                    Kết Nối Ví Mới
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Tùy Chọn Ví</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium">
                          Tự Động Đồng Bộ Số Dư
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Tự động cập nhật số dư ví mỗi 5 phút
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium">
                          Ẩn Số Dư Nhỏ
                        </span>
                        <p className="text-sm text-muted-foreground">
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
