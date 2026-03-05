import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field";
import { MouseEvent, useState } from "react";
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "../ui/accordion";
import { updateStepOne } from "@/actions/taxProfile/updateStepOne";
import { toast } from "react-toastify";

const cards = [
  {
    title: "Solo Proprietor / Independent Contractor",
    description:
      "Self-employed individuals who go into business without registering their business as a legal entity.",
  },
  {
    title: "Single-Member LLC",
    description:
      "A disregarded entity that does not have employees and does not have an excise tax liability does not need an EIN",
  },
  {
    title: "S-Corp",
    description:
      "Corporations that elect to pass corporate income, losses, deductions, and credits through to their shareholders for federal tax purposes.",
  },
];

export default function StepOne() {
  const [businessStructure, setBusinessStructure] = useState<{
    title: string;
    description: string;
  }>({ title: cards[0].title, description: cards[0].description });
  const [otherBusinessStructure, setOtherBusinessStructure] =
    useState<string>("");

  const router = useRouter();

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res = await updateStepOne(businessStructure.title);
    if (res.success) {
      router.push("/dashboard?wizard=true&step=2");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center primary-slate p-4">
      <div className="flex flex-col gap-2 items-center text-primary text-lg font-semibold">
        <h1 className="text-2xl font-bold text-primary">Welcome to Efficio</h1>
        <p className="text-sm primary-slate">
          Let&apos;s get you set up with your account.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-primary text-2xl font-bold text-center">
          Choose your business structure
        </h1>
        <RadioGroup
          defaultValue={cards[0].title}
          className="flex flex-col gap-2"
        >
          {cards.map((card, index) => (
            <FieldLabel
              key={index}
              htmlFor={card.title}
              onClick={() =>
                setBusinessStructure({
                  title: card.title,
                  description: card.description,
                })
              }
            >
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel className="text-primary text-lg font-semibold">
                    {card.title}
                  </FieldLabel>
                  <FieldDescription>{card.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={card.title} id={card.title} />
              </Field>
            </FieldLabel>
          ))}
          <FieldLabel htmlFor="other">
            <Field orientation="horizontal">
              <FieldContent>
                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-primary text-lg font-semibold">
                      Other...
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                      <input
                        type="text"
                        placeholder="Enter your business structure"
                        value={otherBusinessStructure}
                        onChange={(e) =>
                          setOtherBusinessStructure(e.target.value)
                        }
                        className="w-full outline outline-(--accent-green) rounded-lg p-2 focus:outline focus:outline-(--accent-cyan) text-primary mt-2"
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <FieldDescription>
                  If your business structure is not listed, please select
                  &quot;Other&quot; and enter the name of your business
                  structure.
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value="other" id="other" />
            </Field>
          </FieldLabel>
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-2 max-w-md w-full mx-auto">
        <button
          onClick={(e) => handleProceed(e)}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2"
        >
          Proceed <ArrowRightIcon size={20} />
        </button>
        <button
          onClick={() => router.replace("/dashboard")}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
