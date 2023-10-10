import { Icons } from '@/components/icons'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { Space } from "@/types";
import { GroupMembers } from './members';
import { GroupSettings } from './settings';
import { useSpaceId } from '@/hooks/use-space';

type GroupInfoProps = {
  isAdmin: boolean
  space: Space
}

export const GroupInfo = ({ space, isAdmin }: GroupInfoProps) => {
  const spaceId = useSpaceId()

  return (
    <Tabs defaultValue='members'>
      <TabsList className="mb-8">
        <TabsTrigger value='members' className="flex gap-2">
          <Icons.users />
          <span>Members</span>
        </TabsTrigger>
        <TabsTrigger value='settings' className="flex gap-2">
          <Icons.settings />
          <span>Settings</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value='members'>
        <GroupMembers isAdmin={isAdmin} space={space} />
      </TabsContent>
      <TabsContent value='settings'>
        {spaceId && (
          <GroupSettings isAdmin={isAdmin} space={space} spaceId={spaceId} />
        )}
      </TabsContent>
    </Tabs>
  )
}
