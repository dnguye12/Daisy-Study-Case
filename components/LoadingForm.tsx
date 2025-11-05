import { Skeleton } from "./ui/skeleton";

const LoadingForm = () => {
    return (
        <div className="page-layout">
            <Skeleton className="h-5 w-60 bg-daisy-secondary mb-4" />
            <Skeleton className="w-full h-60 bg-daisy-secondary" />
        </div>
    );
}

export default LoadingForm;