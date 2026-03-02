"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
    User,
    FolderPlus,
    MapPin,
    CheckCircle2,
} from "lucide-react";
import { FullFormData, fullFormSchema, step1Schema, step2Schema, step3Schema } from "@/libs/schema";
import Step1 from "@/components/steps/Step1";
import Step2 from "@/components/steps/Step2";
import Step3 from "@/components/steps/Step3";

const steps = [
    { id: 1, title: "Thông tin cá nhân", icon: User, schema: step1Schema },
    { id: 2, title: "Dự án", icon: FolderPlus, schema: step2Schema },
    { id: 3, title: "Gói dịch vụ", icon: MapPin, schema: step3Schema },
];
function getFieldsForStep(step: number): (keyof FullFormData)[] {
    switch (step) {
        case 1:
            return ["name", "about", "industryType", "roleType", "country"];
        case 2:
            return ["description", "workspaceName"];
        case 3:
            return ["plan"];
        default:
            return [];
    }
}
export default function MultiStepForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const form = useForm<FullFormData>({
        resolver: zodResolver(fullFormSchema),
        defaultValues: {
            // schame 1
            about: "",
            industryType: "",
            roleType: "",
            country: "",
            name: "",
            // schame 2
            workspaceName: "",
            description: "",
            plan: "basic",
        },
        mode: "onChange",
    });

    // Đọc ?sstep từ URL khi mount
    useEffect(() => {
        const sstep = searchParams.get("sstep");
        if (sstep) {
            const stepNum = parseInt(sstep, 10);
            if (stepNum >= 1 && stepNum <= steps.length) {
                // Chỉ cho phép nhảy đến step đã hoàn thành hoặc step tiếp theo
                if (stepNum <= Math.max(...completedSteps, 1) + 1) {
                    setCurrentStep(stepNum);
                }
            }
        }
    }, [searchParams, completedSteps]);

    const goToStep = (stepId: number) => {
        // Chỉ cho phép click vào step đã hoàn thành hoặc step hiện tại + 1
        if (stepId <= Math.max(...completedSteps, 1) + 1) {
            setCurrentStep(stepId);
            // Update URL
            router.replace(`?sstep=${stepId}`, { scroll: false });
        }
    };

    const onSubmit: SubmitHandler<FullFormData> = async (data) => {
        console.log("Form hoàn chỉnh submit:", data);
        const {workspaceName, description, plan, ...rest} = data

        // Ví dụ: gọi API
        // try {
        //   await fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) });
        //   toast.success("Đăng ký thành công!");
        //   router.push("/success");
        // } catch (err) {
        //   toast.error("Có lỗi xảy ra");
        // }
    };
    const handleNext = async () => {
        const currentStepFields = getFieldsForStep(currentStep); // tự định nghĩa hàm này

        // Chỉ trigger validate các field của step hiện tại
        const isStepValid = await form.trigger(currentStepFields);

        if (isStepValid) {
            // Đánh dấu step hoàn thành
            setCompletedSteps(prev => [...new Set([...prev, currentStep])]);

            if (currentStep < steps.length) {
                const next = currentStep + 1;
                setCurrentStep(next);
                router.replace(`?sstep=${next}`, { scroll: false });
            } else {
                // Submit toàn bộ
                await form.handleSubmit(onSubmit)();
            }
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            const prev = currentStep - 1;
            setCurrentStep(prev);
            router.replace(`?sstep=${prev}`, { scroll: false });
        }
    };

    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

    const CurrentStepComponent = [Step1, Step2, Step3][currentStep - 1];

    return (
        <FormProvider {...form}>
            <div className="mx-auto max-w-3xl py-10 px-4">
                {/* Progress + Steps clickable */}
                <div className="mb-10">
                    <div className="flex justify-between mb-2">
                        {steps.map((step) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = completedSteps.includes(step.id);
                            const canClick = step.id <= Math.max(...completedSteps, 1) + 1;

                            return (
                                <button
                                    key={step.id}
                                    type="button"
                                    onClick={() => goToStep(step.id)}
                                    disabled={!canClick}
                                    className={cn(
                                        "flex flex-col items-center focus:outline-none",
                                        !canClick && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                                            isActive
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : isCompleted
                                                    ? "border-green-500 bg-green-500 text-white"
                                                    : "border-muted-foreground bg-muted"
                                        )}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            <step.icon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            "mt-2 text-xs font-medium",
                                            isActive && "text-primary",
                                            isCompleted && "text-green-600"
                                        )}
                                    >
                                        {step.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <Progress value={progress} className="h-2" />
                </div>

                {/* Nội dung step */}
                <div className="min-h-[400px]">
                    <CurrentStepComponent />
                </div>

                {/* Nút điều hướng */}
                <div className="flex justify-between mt-10">
                    <Button
                        variant="outline"
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                    >
                        Quay lại
                    </Button>

                    <Button onClick={handleNext}>
                        {currentStep === steps.length ? "Hoàn tất" : "Tiếp theo"}
                    </Button>
                </div>
            </div>
        </FormProvider>
    );
}