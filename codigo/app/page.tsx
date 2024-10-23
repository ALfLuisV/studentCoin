'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Coins, Gift, Send } from 'lucide-react'

// Mock data - replace with actual API calls
const mockUserData = {
  name: "John Doe",
  role: "student", // or "teacher" or "company"
  balance: 500,
  institution: "University of Example",
  course: "Computer Science", // for students
  department: "Engineering", // for teachers
}

const mockTransactions = [
  { id: 1, type: "received", amount: 50, from: "Prof. Smith", reason: "Excellent project work" },
  { id: 2, type: "spent", amount: 100, on: "10% Discount on Textbooks" },
  { id: 3, type: "received", amount: 25, from: "Prof. Johnson", reason: "Active class participation" },
]

export default function Home() {
  const [userData, setUserData] = useState(mockUserData)
  const [transactions, setTransactions] = useState(mockTransactions)

  useEffect(() => {
    // Fetch user data and transactions
    // setUserData(fetchedUserData)
    // setTransactions(fetchedTransactions)
  }, [])

  const renderUserInfo = () => {
    switch (userData.role) {
      case 'student':
        return `${userData.course} at ${userData.institution}`
      case 'teacher':
        return `${userData.department} at ${userData.institution}`
      case 'company':
        return 'Partner Company'
      default:
        return ''
    }
  }

  const renderMainAction = () => {
    switch (userData.role) {
      case 'student':
        return <Button className="w-full"><Gift className="mr-2 h-4 w-4" /> Redeem Advantages</Button>
      case 'teacher':
        return <Button className="w-full"><Send className="mr-2 h-4 w-4" /> Send Coins</Button>
      case 'company':
        return <Button className="w-full"><Gift className="mr-2 h-4 w-4" /> Manage Advantages</Button>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder.svg" alt={userData.name} />
              <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">{userData.name}</CardTitle>
              <CardDescription>{renderUserInfo()}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">{userData.balance}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {transactions.map(transaction => (
                    <li key={transaction.id} className="flex items-center justify-between text-sm">
                      <span>
                        {transaction.type === 'received' ? (
                          <>Received from {transaction.from}</>
                        ) : (
                          <>Spent on {transaction.on}</>
                        )}
                      </span>
                      <Badge variant={transaction.type === 'received' ? 'default' : 'secondary'}>
                        {transaction.type === 'received' ? '+' : '-'}{transaction.amount}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm">You have 3 new notifications</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                {renderMainAction()}
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View Full Transaction History</Button>
        </CardFooter>
      </Card>
    </div>
  )
}