/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { type Database } from "../types/database-raw";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string;
  url: Profiles["avatar_url"];
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = useSupabaseClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) {
      downloadImage(url);
    }
  }, [url]);

  useEffect(() => {
    if (url) {
      downloadImage(url);
    }
  }, [uploading]);
  // don't question this, it's just a hack to get the avatar to update

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  }

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file?.name.split(".").pop();
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file ?? "", { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="relative inline-block justify-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="avatar image mx-auto h-48 w-48 rounded-full border-2 text-center md:h-56 md:w-56"
          />
        ) : (
          <div className="avatar no-image mx-auto h-48 w-48 rounded-full border-2 text-center md:h-56 md:w-56" />
        )}
        <label
          className="absolute bottom-0 right-0 mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-gray-700 text-white opacity-0 ring-1 ring-white hover:opacity-70 md:h-56 md:w-56"
          htmlFor="single"
        >
          {uploading ? "Uploading ..." : "Upload"}
          <input
            style={{
              visibility: "hidden",
              position: "absolute",
            }}
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </label>
      </span>
      <div style={{ width: size }}></div>
    </div>
  );
}
