"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Plus, Wallet } from "lucide-react"
import { useState } from "react"

export default function WalletComponent() {
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false)
  const [wallets, setWallets] = useState([
    {
      id: 1,
      name: "MetaMask",
      address: "0x1234...5678",
      network: "Ethereum",
      status: "connected"
    },
    {
      id: 2,
      name: "Trust Wallet",
      address: "0x9876...4321",
      network: "BSC",
      status: "connected"
    },
    {
      id: 3,
      name: "Phantom",
      address: "0xabcd...efgh",
      network: "Solana",
      status: "disconnected"
    }
  ])
  const [newWallet, setNewWallet] = useState({
    name: "",
    address: "",
    network: "",
    privateKey: ""
  })

  const toggleWalletConnection = (id: number) => {
    setWallets(
      wallets.map((wallet) =>
        wallet.id === id
          ? {
              ...wallet,
              status:
                wallet.status === "connected" ? "disconnected" : "connected"
            }
          : wallet
      )
    )
  }

  const handleAddWallet = () => {
    if (newWallet.name && newWallet.address && newWallet.network) {
      const wallet = {
        id: wallets.length + 1,
        name: newWallet.name,
        address: newWallet.address,
        network: newWallet.network,
        status: "connected" as const
      }
      setWallets([...wallets, wallet])
      setNewWallet({ name: "", address: "", network: "", privateKey: "" })
      setIsAddWalletOpen(false)
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Wallet className='w-5 h-5' />
          Quản lý ví
        </CardTitle>
        <CardDescription>Kết nối và quản lý ví crypto</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className='flex items-center justify-between p-3 border rounded-lg'
            >
              <div>
                <p className='font-medium'>{wallet.name}</p>
                <p className='text-sm text-muted-foreground'>
                  {wallet.address} • {wallet.network}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <Badge
                  variant={
                    wallet.status === "connected" ? "secondary" : "outline"
                  }
                >
                  {wallet.status === "connected"
                    ? "Đã kết nối"
                    : "Chưa kết nối"}
                </Badge>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => toggleWalletConnection(wallet.id)}
                  className={`${
                    wallet.status === "connected" &&
                    "bg-red-700 text-white hover:bg-red-700 hover:text-white"
                  } `}
                >
                  {wallet.status === "connected" ? "Ngắt kết nối" : "Kết nối"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
          <DialogTrigger asChild>
            <Button className='w-full bg-transparent' variant='outline'>
              <Plus className='w-4 h-4 mr-2' />
              Thêm ví mới
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Thêm ví mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin ví crypto để kết nối với MyTokenHub
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='walletName'>Tên ví</Label>
                <Input
                  id='walletName'
                  placeholder='VD: MetaMask, Trust Wallet...'
                  value={newWallet.name}
                  onChange={(e) =>
                    setNewWallet({ ...newWallet, name: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='walletAddress'>Địa chỉ ví</Label>
                <Input
                  id='walletAddress'
                  placeholder='0x...'
                  value={newWallet.address}
                  onChange={(e) =>
                    setNewWallet({ ...newWallet, address: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='network'>Mạng blockchain</Label>
                <Select
                  value={newWallet.network}
                  onValueChange={(value) =>
                    setNewWallet({ ...newWallet, network: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn mạng' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Ethereum'>Ethereum</SelectItem>
                    <SelectItem value='BSC'>Binance Smart Chain</SelectItem>
                    <SelectItem value='Polygon'>Polygon</SelectItem>
                    <SelectItem value='Solana'>Solana</SelectItem>
                    <SelectItem value='Avalanche'>Avalanche</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='privateKey'>Private Key (tùy chọn)</Label>
                <Input
                  id='privateKey'
                  type='password'
                  placeholder='Để trống nếu chỉ xem'
                  value={newWallet.privateKey}
                  onChange={(e) =>
                    setNewWallet({
                      ...newWallet,
                      privateKey: e.target.value
                    })
                  }
                />
                <p className='text-xs text-muted-foreground'>
                  Private key sẽ được mã hóa và lưu trữ an toàn
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsAddWalletOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleAddWallet}>Thêm ví</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
