import { Skeleton } from "@/components/ui/skeleton";


const Loading = () => {
    return (
        <div className="page-layout">
            <Skeleton className="w-full aspect-video bg-daisy-secondary mb-4" />
            <Skeleton className="h-5 w-full bg-daisy-secondary mb-4" />
        </div>
    );
}

export default Loading;