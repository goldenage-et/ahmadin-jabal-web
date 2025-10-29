import { getAuth } from '@/actions/auth.action';
import { getManyInvitations } from '@/actions/invitations.action';
import { InviteMembersSection } from '@/app/_features/store/settings-tabs/sections/invite-members-section';
import { InvitationsTable } from '@/features/users/invitations-table';
import { EInvitationType } from '@repo/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail,
  UserPlus,
  Users
} from 'lucide-react';
import { MembersTable } from './members-table';
import { getManyStoreMembers } from '@/app/_actions/store.action';

interface LayoutProps {
  params: Promise<{}>;
}

export default async function StoreSettingsPage({ params }: LayoutProps) {
  const { user, member } = await getAuth();

  if (!user) {
    return (
      <div className="text-center mt-10">
        You must be logged in to view this page.
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center mt-10">
        No store found. Please contact your administrator.
      </div>
    );
  }

  const members = await getManyStoreMembers({ store: member.store.id });
  if (!members || members.error) {
    return <div>{members?.error}</div>;
  }

  const invitationsRow = await getManyInvitations({ type: EInvitationType.store, targetId: member.store.id });
  const invitations = (invitationsRow && !invitationsRow.error) ? invitationsRow : []

  return (
    <div className="space-y-6">
      {/* Members Overview */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-500/5 via-orange-500/3 to-transparent">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Users className="h-6 w-6 text-orange-500" />
            </div>
            Team Members
          </CardTitle>
          <CardDescription className="text-base">
            Manage your store's team members and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-background/60 border border-border/50 hover:border-border transition-colors">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-xl font-bold">{members.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-background/60 border border-border/50 hover:border-border transition-colors">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{members.filter((member) => member.joinedAt).length}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-background/60 border border-border/50 hover:border-border transition-colors">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{members.filter((member) => !member.joinedAt).length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Tabs */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Tabs defaultValue="members" className="w-full">
            <div className="border-b bg-card">
              <TabsList className="h-auto bg-transparent p-0 w-full justify-start">
                <TabsTrigger
                  value="members"
                  className="flex items-center gap-2 px-6 py-4  data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Users className="h-4 w-4" />
                  Members
                </TabsTrigger>
                <TabsTrigger
                  value="invitations"
                  className="flex items-center gap-2 px-6 py-4 data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Mail className="h-4 w-4" />
                  Invitations
                </TabsTrigger>
                <TabsTrigger
                  value="invite"
                  className="flex items-center gap-2 px-6 py-4  data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <UserPlus className="h-4 w-4" />
                  Invite
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="members" className="mt-0">
                <MembersTable members={members} user={user} />
              </TabsContent>

              <TabsContent value="invitations" className="mt-0">
                <InvitationsTable invitations={invitations} />
              </TabsContent>

              <TabsContent value="invite" className="mt-0">
                <InviteMembersSection member={member} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
