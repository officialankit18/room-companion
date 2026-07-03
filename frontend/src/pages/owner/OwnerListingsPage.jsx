import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { listingApi } from "../../api/listingApi";
import { Button, Card, EmptyState, Input, PageHeader, Select, Spinner, Textarea } from "../../components/ui";
import { listingSchema } from "../../schemas/listingSchema";

export function OwnerListingsPage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      city: "",
      locality: "",
      address: "",
      rent: "",
      availableFrom: "",
      roomType: "Private Room",
      furnishingStatus: "Fully Furnished",
    },
  });

  const loadListings = async () => {
    setIsLoading(true);
    try {
      const response = await listingApi.getListings({ limit: 50 });
      setListings(response.data.listings);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const onSubmit = async (values) => {
    if (!images.length) {
      toast.error("Upload at least one image");
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    images.forEach((image) => formData.append("images", image));

    try {
      await listingApi.createListing(formData);
      toast.success("Listing created");
      reset();
      setImages([]);
      loadListings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const markFilled = async (id) => {
    try {
      await listingApi.markFilled(id);
      toast.success("Listing marked filled");
      loadListings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeListing = async (id) => {
    try {
      await listingApi.deleteListing(id);
      toast.success("Listing removed");
      loadListings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Listings"
        title="Create and manage room listings"
        description="Owners can publish rooms, upload photos, and mark listings filled."
      />

      <Card className="mb-8">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Title" {...register("title")} error={errors.title?.message} />
          <Input label="Rent" type="number" {...register("rent")} error={errors.rent?.message} />
          <Input label="City" {...register("city")} error={errors.city?.message} />
          <Input label="Locality" {...register("locality")} error={errors.locality?.message} />
          <Input label="Address" {...register("address")} error={errors.address?.message} />
          <Input label="Available from" type="date" {...register("availableFrom")} error={errors.availableFrom?.message} />
          <Select label="Room type" {...register("roomType")} error={errors.roomType?.message}>
            <option value="Private Room">Private Room</option>
            <option value="Shared Room">Shared Room</option>
            <option value="Entire Flat">Entire Flat</option>
          </Select>
          <Select label="Furnishing" {...register("furnishingStatus")} error={errors.furnishingStatus?.message}>
            <option value="Fully Furnished">Fully Furnished</option>
            <option value="Semi Furnished">Semi Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </Select>
          <div className="md:col-span-2">
            <Textarea label="Description" {...register("description")} error={errors.description?.message} />
          </div>
          <Input
            label="Images"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => setImages(Array.from(event.target.files).slice(0, 5))}
          />
          <div className="flex items-end">
            <Button type="submit" disabled={isSubmitting}>
              <Plus size={18} />
              {isSubmitting ? "Creating..." : "Create listing"}
            </Button>
          </div>
        </form>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Loading listings" />
        </div>
      ) : listings.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {listings.map((listing) => (
            <Card key={listing._id}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="font-semibold text-[var(--color-heading)]">{listing.title}</h2>
                  <p className="mt-1 text-sm text-[var(--color-body)]">
                    {listing.location.locality}, {listing.location.city} · ₹{listing.rent}/mo · {listing.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" type="button" onClick={() => markFilled(listing._id)}>
                    <CheckCircle2 size={16} /> Filled
                  </Button>
                  <Button variant="danger" size="sm" type="button" onClick={() => removeListing(listing._id)}>
                    <Trash2 size={16} /> Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No listings yet" description="Create your first room listing to start receiving tenant requests." />
      )}
    </>
  );
}

