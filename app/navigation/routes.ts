import { IRoute } from "@/navigation/navigation.types";
import Auth from "@/components/screens/auth/Auth";
import Home from "@/components/screens/home/Home";
import Profile from "@/components/screens/profile/Profile";
import Search from "@/components/screens/search/Search";

export const routes = [
    {
        name: "Home",
        component: Home
    },
    {
        name: "Search",
        component: Search
    },
    {
        name: "Profile",
        component: Profile
    }
]