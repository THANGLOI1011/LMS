"use client";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { FileUpLoad } from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, { 
    message: "Image is required" }),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-black">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData.imageUrl && (
            <>
            <PlusCircle className="h-4 w-4 mr-2"></PlusCircle>
            Add image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
            <Pencil className="h-4 w-4 mr-2"></Pencil>
            Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
              <Image
                alt="Upload"
                fill
                className="object-cover rounded-md"
                src={initialData.imageUrl}
              
              />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpLoad
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              } else {
                toast.error("Failed to upload image. Please try again.");
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
