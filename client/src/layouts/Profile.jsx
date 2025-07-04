import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User } from "lucide-react";
import { Logoutthunk, Updateuserthunk } from "@/Features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

export function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const letter = user?.username?.[0]?.toUpperCase() || "Z";
const [newusername, setnewusername] = useState(user?.username || "");
useEffect(() => {
  if (user?.username) {
    setnewusername(user.username);
  }
}, [user?.username]);

  const handleLogout = () => {
    dispatch(Logoutthunk());
  };
const handleupdate=(data)=>{
  dispatch(Updateuserthunk(data))
}
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <User className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-neutral-700 w-16 h-16 flex items-center justify-center text-white text-2xl">
            {letter}
          </div>
          <SheetTitle className="text-lg">{user?.username || "Anonymous"}</SheetTitle>
          <SheetDescription>
  Welcome to your profile. Make changes and manage your identity with ease.
          </SheetDescription>
          <Button variant="destructive" onClick={handleLogout}>
            Log out
          </Button>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4 mt-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" value={newusername} onChange={(e)=>setnewusername(e.target.value)} />
          </div>
        </div>
        <SheetFooter className="mt-4">
          <Button type="submit" onClick={()=>handleupdate({username:newusername})}>Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}