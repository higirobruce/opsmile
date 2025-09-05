import { CheckIcon, ClockIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export default function SimpleBadge({ text }: { text: string }) {
    return (
        <Badge variant="outline" className="gap-1">
            {
                text == 'completed' ?
                    <CheckIcon className="text-emerald-500" size={12} aria-hidden="true" />
                    :
                    text == 'pending' ?
                        <ClockIcon className="text-yellow-500" size={12} aria-hidden="true" />
                        :
                        text == 'failed' ?
                            <XIcon className="text-red-500" size={12} aria-hidden="true" />
                            :
                            text == 'sample collected' ?
                                <CheckIcon className="text-blue-500" size={12} aria-hidden="true" />
                                :
                                ''
            }
            {text == 'sample collected' ? 'Sample Collected' : null}
            {text == 'completed' ? 'Completed' : null}
            {text == 'pending' ? 'Pending' : null}
            {text == 'failed' ? 'Failed' : null}


        </Badge>
    )
}
