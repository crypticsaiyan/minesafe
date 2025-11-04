import { Clock, User, Pin } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function BulletinCard({ item, type }) {
    return (
        <Card className="relative shadow-sm hover:shadow-md transition-all cursor-pointer bg-yellow-50 hover:bg-yellow-100">
            <Pin className="absolute top-2 right-2 h-4 w-4 text-gray-400 rotate-45" />
            <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm font-bold text-gray-800 pr-6">
                    {item.title}
                </CardTitle>
                {type === 'update' && item.time && (
                    <CardDescription className="text-xs flex items-center gap-1 mt-1 text-gray-600">
                        <Clock className="h-3 w-3" />
                        {item.time}
                    </CardDescription>
                )}
                {type === 'suggestion' && item.author && (
                    <CardDescription className="text-xs flex items-center gap-1 mt-1 text-gray-600">
                        <User className="h-3 w-3" />
                        {item.author}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <p className="text-xs text-gray-700 leading-relaxed border-t border-dashed border-gray-300 pt-2 mt-1">
                    {item.description}
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {type === 'update' && item.tag && (
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-sm shadow-sm">
                            {item.tag}
                        </span>
                    )}
                    {type === 'suggestion' && item.priority && (
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-sm shadow-sm ${item.priority === 'high'
                            ? 'bg-red-600 text-white'
                            : item.priority === 'medium'
                                ? 'bg-orange-500 text-white'
                                : 'bg-green-600 text-white'
                            }`}>
                            {item.priority.toUpperCase()}
                        </span>
                    )}
                </div>
            </CardContent>
            {/* Tape effect */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-white opacity-60 shadow-sm rotate-1"></div>
        </Card>
    );
}
