import { getCurrentUser } from "@/lib/session";
import Calendar from "./components/Calendar";

const CalendarPage = async() => {
    const user = await getCurrentUser()

    if(!user) {
        return (<div>...loading</div>)
    }
    
    return (
        <div className="page-layout flex flex-col gap-y-2">
            <Calendar userId={user.id}/>
        </div>
    );
}

export default CalendarPage;