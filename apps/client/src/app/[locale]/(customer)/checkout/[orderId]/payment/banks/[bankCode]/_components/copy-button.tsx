'use client';

import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CopyButtonProps {
    text: string;
    label: string;
}

export function CopyButton({ text, label }: CopyButtonProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
        >
            <Copy className="h-4 w-4 mr-2" />
            Copy
        </Button>
    );
}


