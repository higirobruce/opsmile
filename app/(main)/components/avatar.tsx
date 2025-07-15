import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export default function AvatarComponent({height=11, width=11, source}: {height: number, width: number, source: string}) {
    return (
        <Avatar className={`h-${height} w-${width} rounded-md mb-2`}>
            <AvatarImage src={source} alt="Kelly King" />
            <AvatarFallback>KK</AvatarFallback>
        </Avatar>
    )
}
