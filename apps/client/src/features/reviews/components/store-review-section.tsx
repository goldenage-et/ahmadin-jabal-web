// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { EReviewReportReason, TCreateStoreReview, TStoreReviewQueryFilter } from "@repo/common";
// import { useEffect, useState } from "react";
// import { markBookReviewHelpful, reportBookReview } from "../actions/review.action";
// import { StoreReviewForm } from "./store-review-form";
// import { useApiMutation } from "@/hooks/use-api-mutation";

// interface StoreReviewSectionProps {
//     storeId: string;
//     currentUserId?: string;
//     reviews?: any[];
//     analytics?: any;
// }

// export function StoreReviewSection({
//     storeId,
//     currentUserId,
//     analytics,
// }: StoreReviewSectionProps) {
//     const [showReviewForm, setShowReviewForm] = useState(false);
//     const { mutate: markHelpfulMutate, isLoading: isMarkHelpfulLoading } = useApiMutation();
//     const { mutate: reportReviewMutate, isLoading: isReportReviewLoading } = useApiMutation();

//     const handleMarkHelpful = async (reviewId: string) => {
//         await markHelpfulMutate(() => markBookReviewHelpful({
//             reviewId,
//             helpful: true
//         }), {
//             errorMessage: 'Error marking review as helpful',
//             successMessage: 'Review marked as helpful'
//         }
//         );
//     };

//     const handleReportReview = async (reviewId: string) => {
//         await reportReviewMutate(() => reportBookReview({
//             reviewId,
//             reason: EReviewReportReason.inappropriate,
//             description: 'This review contains inappropriate content'
//         }), {
//             errorMessage: 'Error reporting review',
//             successMessage: 'Review reported'
//         }
//         );
//     };

//     return (
//         <div className="space-y-6">
//             {/* Store Review Stats */}
//             {analytics && (
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Store Reviews</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="flex items-center space-x-4">
//                             <div className="text-3xl font-bold">
//                                 {analytics.averageRating.toFixed(1)}
//                             </div>
//                             <div className="space-y-1">
//                                 <div className="flex items-center space-x-1">
//                                     {[1, 2, 3, 4, 5].map((star) => (
//                                         <span
//                                             key={star}
//                                             className={`text-lg ${star <= Math.floor(analytics.averageRating)
//                                                 ? "text-yellow-400"
//                                                 : "text-gray-300"
//                                                 }`}
//                                         >
//                                             ★
//                                         </span>
//                                     ))}
//                                 </div>
//                                 <p className="text-sm text-gray-600">
//                                     Based on {analytics.totalReviews} review{analytics.totalReviews !== 1 ? 's' : ''}
//                                 </p>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Review Form */}
//             {currentUserId && !showReviewForm && (
//                 <Card>
//                     <CardContent className="p-6">
//                         <div className="text-center">
//                             <h3 className="text-lg font-semibold mb-2">Review This Store</h3>
//                             <p className="text-gray-600 mb-4">Share your experience with this store</p>
//                             <Button onClick={() => setShowReviewForm(true)}>
//                                 Write a Store Review
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Review Form Modal */}
//             {showReviewForm && (
//                 <StoreReviewForm
//                     storeId={storeId}
//                     onSubmit={() => setShowReviewForm(false)}
//                     onCancel={() => setShowReviewForm(false)}
//                 />
//             )}

//             {/* Reviews List */}
//             <Tabs defaultValue="all" className="w-full">
//                 <TabsList className="grid w-full grid-cols-4">
//                     <TabsTrigger value="all">All Reviews</TabsTrigger>
//                     <TabsTrigger value="5">5 Stars</TabsTrigger>
//                     <TabsTrigger value="4">4 Stars</TabsTrigger>
//                     <TabsTrigger value="3">3 Stars</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="all" className="mt-6">
//                     <div className="space-y-4">
//                         {isLoading ? (
//                             <div className="text-center py-8">Loading reviews...</div>
//                         ) : reviews.length === 0 ? (
//                             <div className="text-center py-8 text-gray-500">No reviews yet.</div>
//                         ) : (
//                             reviews.map((review) => (
//                                 <Card key={review.id}>
//                                     <CardContent className="p-6">
//                                         <div className="flex items-start justify-between mb-4">
//                                             <div className="flex items-center space-x-3">
//                                                 <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//                                                     <span className="text-sm font-medium">
//                                                         {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
//                                                     </span>
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-medium">
//                                                         {review.user?.firstName} {review.user?.lastName}
//                                                     </p>
//                                                     <div className="flex items-center">
//                                                         {[1, 2, 3, 4, 5].map((star) => (
//                                                             <span
//                                                                 key={star}
//                                                                 className={`text-sm ${star <= review.rating ? "text-yellow-400" : "text-gray-300"
//                                                                     }`}
//                                                             >
//                                                                 ★
//                                                             </span>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             {review.verified && (
//                                                 <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                                                     Verified Purchase
//                                                 </span>
//                                             )}
//                                         </div>
//                                         {review.title && <h4 className="font-medium mb-2">{review.title}</h4>}
//                                         {review.comment && <p className="text-gray-700 mb-4">{review.comment}</p>}
//                                         <div className="flex items-center justify-between text-sm text-gray-500">
//                                             <span>{new Date(review.createdAt).toLocaleDateString()}</span>
//                                             <div className="flex items-center space-x-4">
//                                                 <button
//                                                     onClick={() => handleMarkHelpful(review.id)}
//                                                     className="flex items-center space-x-1 hover:text-blue-600"
//                                                 >
//                                                     <span>👍</span>
//                                                     <span>{review.helpful} helpful</span>
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleReportReview(review.id)}
//                                                     className="text-red-600 hover:text-red-800"
//                                                 >
//                                                     Report
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             ))
//                         )}
//                     </div>
//                 </TabsContent>

//                 <TabsContent value="5" className="mt-6">
//                     <div className="space-y-4">
//                         {reviews.filter(review => review.rating === 5).map((review) => (
//                             <Card key={review.id}>
//                                 <CardContent className="p-6">
//                                     <div className="flex items-start justify-between mb-4">
//                                         <div className="flex items-center space-x-3">
//                                             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//                                                 <span className="text-sm font-medium">
//                                                     {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
//                                                 </span>
//                                             </div>
//                                             <div>
//                                                 <p className="font-medium">
//                                                     {review.user?.firstName} {review.user?.lastName}
//                                                 </p>
//                                                 <div className="flex items-center">
//                                                     {[1, 2, 3, 4, 5].map((star) => (
//                                                         <span
//                                                             key={star}
//                                                             className={`text-sm ${star <= review.rating ? "text-yellow-400" : "text-gray-300"
//                                                                 }`}
//                                                         >
//                                                             ★
//                                                         </span>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {review.verified && (
//                                             <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                                                 Verified Purchase
//                                             </span>
//                                         )}
//                                     </div>
//                                     {review.title && <h4 className="font-medium mb-2">{review.title}</h4>}
//                                     {review.comment && <p className="text-gray-700 mb-4">{review.comment}</p>}
//                                     <div className="flex items-center justify-between text-sm text-gray-500">
//                                         <span>{new Date(review.createdAt).toLocaleDateString()}</span>
//                                         <div className="flex items-center space-x-4">
//                                             <button
//                                                 onClick={() => handleMarkHelpful(review.id)}
//                                                 className="flex items-center space-x-1 hover:text-blue-600"
//                                             >
//                                                 <span>👍</span>
//                                                 <span>{review.helpful} helpful</span>
//                                             </button>
//                                             <button
//                                                 onClick={() => handleReportReview(review.id)}
//                                                 className="text-red-600 hover:text-red-800"
//                                             >
//                                                 Report
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </div>
//                 </TabsContent>

//                 <TabsContent value="4" className="mt-6">
//                     <div className="space-y-4">
//                         {reviews.filter(review => review.rating === 4).map((review) => (
//                             <Card key={review.id}>
//                                 <CardContent className="p-6">
//                                     <div className="flex items-start justify-between mb-4">
//                                         <div className="flex items-center space-x-3">
//                                             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//                                                 <span className="text-sm font-medium">
//                                                     {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
//                                                 </span>
//                                             </div>
//                                             <div>
//                                                 <p className="font-medium">
//                                                     {review.user?.firstName} {review.user?.lastName}
//                                                 </p>
//                                                 <div className="flex items-center">
//                                                     {[1, 2, 3, 4, 5].map((star) => (
//                                                         <span
//                                                             key={star}
//                                                             className={`text-sm ${star <= review.rating ? "text-yellow-400" : "text-gray-300"
//                                                                 }`}
//                                                         >
//                                                             ★
//                                                         </span>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {review.verified && (
//                                             <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                                                 Verified Purchase
//                                             </span>
//                                         )}
//                                     </div>
//                                     {review.title && <h4 className="font-medium mb-2">{review.title}</h4>}
//                                     {review.comment && <p className="text-gray-700 mb-4">{review.comment}</p>}
//                                     <div className="flex items-center justify-between text-sm text-gray-500">
//                                         <span>{new Date(review.createdAt).toLocaleDateString()}</span>
//                                         <div className="flex items-center space-x-4">
//                                             <button
//                                                 onClick={() => handleMarkHelpful(review.id)}
//                                                 className="flex items-center space-x-1 hover:text-blue-600"
//                                             >
//                                                 <span>👍</span>
//                                                 <span>{review.helpful} helpful</span>
//                                             </button>
//                                             <button
//                                                 onClick={() => handleReportReview(review.id)}
//                                                 className="text-red-600 hover:text-red-800"
//                                             >
//                                                 Report
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </div>
//                 </TabsContent>

//                 <TabsContent value="3" className="mt-6">
//                     <div className="space-y-4">
//                         {reviews.filter(review => review.rating === 3).map((review) => (
//                             <Card key={review.id}>
//                                 <CardContent className="p-6">
//                                     <div className="flex items-start justify-between mb-4">
//                                         <div className="flex items-center space-x-3">
//                                             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//                                                 <span className="text-sm font-medium">
//                                                     {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
//                                                 </span>
//                                             </div>
//                                             <div>
//                                                 <p className="font-medium">
//                                                     {review.user?.firstName} {review.user?.lastName}
//                                                 </p>
//                                                 <div className="flex items-center">
//                                                     {[1, 2, 3, 4, 5].map((star) => (
//                                                         <span
//                                                             key={star}
//                                                             className={`text-sm ${star <= review.rating ? "text-yellow-400" : "text-gray-300"
//                                                                 }`}
//                                                         >
//                                                             ★
//                                                         </span>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {review.verified && (
//                                             <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                                                 Verified Purchase
//                                             </span>
//                                         )}
//                                     </div>
//                                     {review.title && <h4 className="font-medium mb-2">{review.title}</h4>}
//                                     {review.comment && <p className="text-gray-700 mb-4">{review.comment}</p>}
//                                     <div className="flex items-center justify-between text-sm text-gray-500">
//                                         <span>{new Date(review.createdAt).toLocaleDateString()}</span>
//                                         <div className="flex items-center space-x-4">
//                                             <button
//                                                 onClick={() => handleMarkHelpful(review.id)}
//                                                 className="flex items-center space-x-1 hover:text-blue-600"
//                                             >
//                                                 <span>👍</span>
//                                                 <span>{review.helpful} helpful</span>
//                                             </button>
//                                             <button
//                                                 onClick={() => handleReportReview(review.id)}
//                                                 className="text-red-600 hover:text-red-800"
//                                             >
//                                                 Report
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </div>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// }
