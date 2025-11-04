'use client'

import { useState } from 'react';
import { ChevronDown, Bell, Lightbulb, Clock, User } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import BulletinCard from '../components/BulletinCard';

export default function AppSidebar({ updates = [], suggestions = [] }) {
    const [updatesOpen, setUpdatesOpen] = useState(false);
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);

    return (
        <Sidebar>
            <SidebarContent className="overflow-y-auto">
                <SidebarGroup>
                    <Collapsible open={updatesOpen} onOpenChange={setUpdatesOpen}>
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton className="w-full hover:bg-yellow-100">
                                    <Bell className="h-5 w-5" />
                                    <span className="font-semibold">Updates</span>
                                    <ChevronDown
                                        className={`ml-auto h-4 w-4 transition-transform ${updatesOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-2 py-2">
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {updates.length > 0 ? (
                                        updates.map((update, index) => (
                                            <BulletinCard key={index} item={update} type="update" />
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-500 text-center py-4 bg-yellow-50 border border-dashed border-gray-300 rounded">
                                            No updates pinned
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarGroup>

                <SidebarGroup>
                    <Collapsible open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton className="w-full hover:bg-yellow-100">
                                    <Lightbulb className="h-5 w-5" />
                                    <span className="font-semibold">Suggestions</span>
                                    <ChevronDown
                                        className={`ml-auto h-4 w-4 transition-transform ${suggestionsOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-2 py-2">
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {suggestions.length > 0 ? (
                                        suggestions.map((suggestion, index) => (
                                            <BulletinCard key={index} item={suggestion} type="suggestion" />
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-500 text-center py-4 bg-yellow-50 border border-dashed border-gray-300 rounded">
                                            No suggestions pinned
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}