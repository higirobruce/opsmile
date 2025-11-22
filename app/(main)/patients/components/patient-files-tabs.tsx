import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from "lucide-react"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function Component({ patientFiles }: { patientFiles: [] }) {
    return (
        <Tabs
            defaultValue="tab-1"
            orientation="vertical"
            className="w-full flex-row"
        >
            <TabsList className="flex-col gap-1 rounded-none bg-transparent px-1 py-0 text-foreground">
                {patientFiles.map((pFile: any) => {
                    return <TabsTrigger
                        value={pFile?._id}
                        className="relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                    >
                        <HouseIcon
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            aria-hidden="true"
                        />
                        {pFile.program.name}
                    </TabsTrigger>
                })}

            </TabsList>
            {patientFiles?.map((pFile: any) => {
                return <TabsContent value={pFile?._id}>
                    
                </TabsContent>
            })}
        </Tabs>
    )
}
