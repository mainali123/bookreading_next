import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Control, FieldValues, Path} from "react-hook-form";

interface TextInputProps<T extends FieldValues = FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: string;
    className?: string;
    required?: boolean;
}

const TextInput = <T extends FieldValues = FieldValues>({
                                                            control,
                                                            name,
                                                            label,
                                                            placeholder,
                                                            type = "password",
                                                            className,
                                                            required = false,
                                                        }: TextInputProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({field}) => (
                <FormItem className={className}>
                    <FormLabel className={required ? "flex items-center gap-0.5" : ""}>
                        <span className="text-foreground">{label}</span>
                        {required && (
                            <span className="text-text-error">*</span>
                        )}
                    </FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} type={type} {...field} />
                    </FormControl>
                    <FormMessage className="text-text-error"/>
                </FormItem>
            )}
        />
    );
};

export default TextInput;