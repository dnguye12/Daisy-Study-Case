import { Skeleton } from "@/components/ui/skeleton";


const Loading = () => {
    return (
        <div className="page-layout">
            <Skeleton className="w-full h-full bg-daisy-secondary" />
        </div>
    );
}

export default Loading;