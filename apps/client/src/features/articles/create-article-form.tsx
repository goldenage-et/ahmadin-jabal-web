'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    TCategoryBasic,
    TCreateArticle,
    ZCreateArticle,
    EArticleStatus,
    TArticleImage,
} from '@repo/common';
import { ArrowLeft, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createArticle } from '@/actions/article.action';
import { uploadFile } from '@/lib/file-upload';
import { slugify } from '@/lib/slugify';
import { toast } from 'sonner';

interface CreateArticleFormProps {
    categories?: TCategoryBasic[];
}

export default function CreateArticleForm({
    categories = [],
}: CreateArticleFormProps) {
    const router = useRouter();
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [featuredImage, setFeaturedImage] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const { mutate, isLoading } = useApiMutation();

    const form = useForm<TCreateArticle>({
        resolver: zodResolver(ZCreateArticle) as any,
        defaultValues: {
            title: '',
            titleEn: '',
            slug: '',
            excerpt: '',
            content: '',
            contentEn: '',
            tags: [],
            status: EArticleStatus.draft,
            featured: false,
            isFree: true,
            price: undefined,
            featuredImage: undefined,
            images: [],
            metaTitle: '',
            metaDescription: '',
            metaKeywords: [],
            publishedAt: undefined,
            expiresAt: undefined,
        },
    });

    // Auto-generate slug from title
    const title = form.watch('title');
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    useEffect(() => {
        if (title && !isSlugManuallyEdited) {
            const generatedSlug = slugify(title);
            form.setValue('slug', generatedSlug);
        }
    }, [title, form, isSlugManuallyEdited]);

    // Track if user manually edits the slug
    const handleSlugChange = (value: string) => {
        setIsSlugManuallyEdited(true);
        form.setValue('slug', value);
    };

    const addTag = () => {
        const trimmed = newTag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            const newTagsArr = [...tags, trimmed];
            setTags(newTagsArr);
            form.setValue('tags', newTagsArr);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const filtered = tags.filter((tag) => tag !== tagToRemove);
        setTags(filtered);
        form.setValue('tags', filtered);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadFile(file);
            setFeaturedImage(url);
            form.setValue('featuredImage', url);
            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className='space-y-6 p-6 mx-auto bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((data) => {
                        mutate(async () => await createArticle(data), {
                            onSuccess: (created) => {
                                if ('id' in created && typeof created.id === 'string') {
                                    router.push(`/admin/articles/${created.id}`);
                                }
                            },
                            successMessage: 'Article created successfully',
                            errorMessage: 'Failed to create article',
                        });
                    })}
                    className='space-y-6'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title *</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter article title' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='titleEn'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>English Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter English title (optional)' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            <FormField
                                control={form.control}
                                name='excerpt'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Excerpt</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Brief description of the article'
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='content'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <RichTextEditor
                                                content={field.value || ''}
                                                onChange={field.onChange}
                                                placeholder='Start writing your article...'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {categories.length > 0 && (
                                <FormField
                                    control={form.control}
                                    name='categoryId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select a category' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(value as EArticleStatus)
                                            }
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={EArticleStatus.draft}>Draft</SelectItem>
                                                <SelectItem value={EArticleStatus.published}>
                                                    Published
                                                </SelectItem>
                                                <SelectItem value={EArticleStatus.archived}>
                                                    Archived
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex items-center gap-4'>
                                <FormField
                                    control={form.control}
                                    name='featured'
                                    render={({ field }) => (
                                        <FormItem className='flex items-center gap-2'>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel>Featured Article</FormLabel>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='isFree'
                                    render={({ field }) => (
                                        <FormItem className='flex items-center gap-2'>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel>Free Article</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name='price'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder='0.00'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ? parseFloat(e.target.value) : undefined,
                                                    )
                                                }
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='featuredImage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Featured Image</FormLabel>
                                        <FormControl>
                                            <div className='space-y-2'>
                                                <Input
                                                    type='file'
                                                    accept='image/*'
                                                    onChange={handleImageUpload}
                                                    disabled={isUploading}
                                                />
                                                {featuredImage && (
                                                    <div className='relative w-32 h-32'>
                                                        <img
                                                            src={featuredImage}
                                                            alt='Featured'
                                                            className='w-full h-full object-cover rounded'
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex gap-2'>
                                <Input
                                    placeholder='Add a tag'
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                                <Button type='button' onClick={addTag}>
                                    <Plus className='h-4 w-4' />
                                </Button>
                            </div>
                            {tags.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                    {tags.map((tag) => (
                                        <Badge key={tag} variant='secondary' className='gap-1'>
                                            {tag}
                                            <button
                                                type='button'
                                                onClick={() => removeTag(tag)}
                                                className='ml-1 hover:text-destructive'
                                            >
                                                <X className='h-3 w-3' />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Settings</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='metaTitle'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meta Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder='SEO title' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='metaDescription'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meta Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='SEO description'
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className='flex items-center gap-4'>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className='h-4 w-4 mr-2' />
                            Cancel
                        </Button>
                        <Button type='submit' disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Article'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

