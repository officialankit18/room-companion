import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { tenantProfileApi } from "../../api/tenantProfileApi";
import { Button, Card, Input, PageHeader, Select, Spinner } from "../../components/ui";
import { tenantProfileSchema } from "../../schemas/tenantProfileSchema";

export function TenantProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tenantProfileSchema),
    defaultValues: {
      city: "",
      locality: "",
      minBudget: 7000,
      maxBudget: 15000,
      moveInDate: "",
      preferredRoomType: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await tenantProfileApi.getProfile();
        const profile = response.data.profile;
        reset({
          city: profile.preferredLocation.city,
          locality: profile.preferredLocation.locality || "",
          minBudget: profile.budget.min,
          maxBudget: profile.budget.max,
          moveInDate: profile.moveInDate?.slice(0, 10),
          preferredRoomType: profile.preferredRoomType || "",
        });
      } catch {
        // A missing profile is expected for new tenants.
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  const onSubmit = async (values) => {
    try {
      await tenantProfileApi.saveProfile(values);
      toast.success("Tenant profile saved");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Set your room preferences"
        description="Compatibility scores are generated from this profile and cached until your preferences change."
      />

      <Card className="max-w-3xl">
        {isLoading ? (
          <Spinner label="Loading profile" />
        ) : (
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Preferred city" {...register("city")} error={errors.city?.message} />
            <Input label="Locality" {...register("locality")} error={errors.locality?.message} />
            <Input
              label="Minimum budget"
              type="number"
              {...register("minBudget")}
              error={errors.minBudget?.message}
            />
            <Input
              label="Maximum budget"
              type="number"
              {...register("maxBudget")}
              error={errors.maxBudget?.message}
            />
            <Input
              label="Move-in date"
              type="date"
              {...register("moveInDate")}
              error={errors.moveInDate?.message}
            />
            <Select
              label="Preferred room type"
              {...register("preferredRoomType")}
              error={errors.preferredRoomType?.message}
            >
              <option value="">Any</option>
              <option value="Private Room">Private Room</option>
              <option value="Shared Room">Shared Room</option>
              <option value="Entire Flat">Entire Flat</option>
            </Select>
            <div className="md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                <Save size={18} />
                {isSubmitting ? "Saving..." : "Save profile"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </>
  );
}
