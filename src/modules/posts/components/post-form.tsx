import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { ICONS } from "../../../shared/ui/icons";
import {
    Controller,
    useFieldArray,
    useForm,
    UseFormProps,
} from "react-hook-form";
import { Input } from "../../../shared/ui/input/input";
import { ICreatePostForm, IPostTag } from "../types";
import { renderError } from "../../../shared/utils/errors";
import { BinIcon } from "../../../shared/ui/icons/bin-icon";
import { pickImage } from "../../../shared/utils/images";
import { Tag } from "../components/tag";
import { Button, RoundedButton } from "../../../shared/ui/button/button";
import { useTags } from "../hooks/use-tags";
import { postsService } from "../services";

export function PostForm({
    defaultValues,
    onSubmit,
    isPartialForm,
    onSuccess
}: {
    defaultValues: UseFormProps<ICreatePostForm>["defaultValues"];
    onSubmit: (data: ICreatePostForm) => Promise<string | void>;
    isPartialForm?: boolean;
    onSuccess?: () => void;
}) {
    // images contains array of base64 encoded selected images
    const [images, setImages] = useState<ICreatePostForm["images"]>([]);
    const [showCreateTagInput, setShowCreateTagInput] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const { tags, setTags } = useTags();

    const {
        handleSubmit,
        control,
        setError,
        formState: { errors },
        setValue,
        getValues
    } = useForm<ICreatePostForm>({ defaultValues });
    const {
        fields: linkInputs,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "links",
    });

    const onFormSubmit = async (data: ICreatePostForm) => {
        data.images.push(...images);
        const errMsg = await onSubmit(data);
        if (errMsg) {
            return setError("root", { message: errMsg });
        }
        onSuccess && onSuccess();
    };
    const { fields: tagInputs } = useFieldArray({
        control,
        name: "tags",
    });
    const pickPostImages = async () => {
        const result = await pickImage({
            mediaTypes: "images",
            allowsMultipleSelection: true,
            base64: true,
        });
        if (result && !result.canceled && result.assets) {
            setImages((prev) => [
                ...prev,
                ...result.assets.map((asset) => String(asset.uri)),
            ]);
        }
    };


    const createTag = async (name: string) => {
        try {
            const newTag = await postsService.createTag(name);
            setTags((prev) => [...prev, newTag]);
            console.log("Current tags", getValues("tags"))
            // setValue("tags", [...getValues("tags"), newTag])
        } catch (error) {
            console.error("Не удалось создать тег:", error);
        }
    };

    useEffect(() => {
        append({ url: "", id: 0 });
    }, []);
    return (
        <>
            <View className="gap-2">
                <Controller
                    control={control}
                    name="title"
                    rules={{
                        required: {
                            value: !isPartialForm,
                            message: "Назва публікації обов’язкова",
                        },
                        maxLength: {
                            value: 50,
                            message: "Максимум 50 символів",
                        },
                    }}
                    render={({ field, fieldState }) => {
                        return (
                            <Input
                                className="w-full"
                                placeholder="Напишіть назву публікації"
                                onChange={field.onChange}
                                onChangeText={field.onChange}
                                value={field.value}
                                label="Назва публікації"
                                autoCorrect={false}
                                err={fieldState.error}
                            />
                        );
                    }}
                />

                <Controller
                    control={control}
                    name="subject"
                    rules={{
                        required: {
                            value: !isPartialForm,
                            message: "Тема публікації обов’язкова",
                        },
                    }}
                    render={({ field, fieldState }) => {
                        return (
                            <Input
                                className="w-full"
                                placeholder="Напишіть тему публікації"
                                onChange={field.onChange}
                                onChangeText={field.onChange}
                                value={field.value}
                                label="Тема публікації"
                                autoCorrect={false}
                                err={fieldState.error}
                            />
                        );
                    }}
                />

                <Controller
                    control={control}
                    name="tags"
                    render={({ field }) => (
                        <Tag
                            tags={tags}
                            selectedTags={field.value}
                            onToggle={(tag) => {
                                const isSelected = field.value.some(
                                    (t) => t.id === tag.id
                                );
                                if (isSelected) {
                                    field.onChange(
                                        field.value.filter(
                                            (t) => t.id !== tag.id
                                        )
                                    );
                                } else {
                                    field.onChange([...field.value, tag]);
                                }
                            }}
                        />
                    )}
                />
                <RoundedButton
                    className="w-5 h-5 mb-2"
                    onPress={() => setShowCreateTagInput(true)}
                    icon={
                        <ICONS.PlusForPostIcon
                            width={15}
                            height={15}
                            fill="#543B52"
                        />
                    }
                />
            </View>

            {showCreateTagInput && (
                <View className="flex-row items-center w-full mb-3">
                    <Input
                        className="w-10/12"
                        value={newTagName}
                        onChangeText={setNewTagName}
                        placeholder="Новий тег..."
                    />
                    {/* <TouchableOpacity */}
                    {/*     onPress={async () => { */}
                    {/*         await createTag(newTagName); */}
                    {/*         setNewTagName(""); */}
                    {/*         setShowCreateTagInput(false); */}
                    {/*     }} */}
                    {/*     className="p-2 bg-slive rounded-2xl flex-1 w-full" */}
                    {/* > */}
                    {/*     <ICONS.PlusIcon width={20} height={20} /> */}
                    {/*     <Text className="text-white">Додати</Text> */}
                    {/* </TouchableOpacity> */}
                    <RoundedButton
                        onPress={async () => {
                            if (!newTagName.trim()) return;
                            await createTag(newTagName);
                            setNewTagName("");
                            setShowCreateTagInput(false);
                        }}
                        icon={<ICONS.PlusIcon width={15} height={15} />}
                    />
                </View>
            )}

            <Controller
                control={control}
                name="content"
                rules={{
                    required: {
                        value: true,
                        message: "Тема публікації обов’язкова",
                    },
                }}
                render={({ field, fieldState }) => {
                    return (
                        <Input
                            placeholder="Введіть текст..."
                            onChange={field.onChange}
                            onChangeText={field.onChange}
                            value={field.value}
                            autoCorrect={false}
                            err={fieldState.error}
                            numberOfLines={4}
                            multiline
                            className="h-28 align-top w-full flex-wrap"
                        />
                    );
                }}
            />
            {linkInputs.map((input, i) => {
                const inputTag = (
                    <Controller
                        key={input.id}
                        control={control}
                        name={`links.${i}.url` as const}
                        render={({ field, fieldState }) => {
                            return (
                                <Input
                                    className="w-full"
                                    placeholder="Напишіть посилання"
                                    onChange={field.onChange}
                                    onChangeText={field.onChange}
                                    value={field.value || ""}
                                    label="Посилання"
                                    autoCorrect={false}
                                    err={fieldState.error}
                                />
                            );
                        }}
                    />
                );
                return i + 1 == linkInputs.length ? (
                    <View
                        className="flex-row w-10/12 items-center gap-2 flex-1"
                        key={input.id}
                    >
                        {inputTag}
                        <RoundedButton
                            className="w-5 h-5 translate-y-1/2 flex-1"
                            onPress={() => append({ url: "", id: i + 1 })}
                            icon={<ICONS.PlusIcon width={15} height={15} />}
                        />
                        {i >= 1 ? (
                            <RoundedButton
                                className="w-5 h-5 translate-y-1/2 "
                                onPress={() => {
                                    if (i >= 1) {
                                        remove(i - 1);
                                    }
                                }}
                                icon={
                                    <ICONS.CrossIcon
                                        width={15}
                                        height={15}
                                        fill="#543B52"
                                    />
                                }
                            />
                        ) : (
                            ""
                        )}
                    </View>
                ) : (
                    inputTag
                );
            })}

            <View
                style={{ minHeight: 1, maxHeight: 288 }}
                className="mt-2 mb-3 rounded-3xl justify-center"
            >
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {images.map((imageData, index) => (
                        <View key={index} className="mr-2 relative">
                            <Image
                                source={{ uri: imageData }}
                                className="h-72 w-72 rounded-3xl"
                                resizeMode="cover"
                            />
                            <View className="absolute w-10 h-10 bg-white top-3 right-3 border rounded-full justify-center items-center">
                                <TouchableOpacity
                                    onPress={() =>
                                        setImages(
                                            images.filter(
                                                (img) => img != imageData
                                            )
                                        )
                                    }
                                >
                                    <BinIcon width={20} height={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            {renderError(errors.root)}
            <View className="flex-row justify-end gap-2">
                <TouchableOpacity
                    onPress={pickPostImages}
                    className="border border-slive p-2 rounded-3xl"
                >
                    <ICONS.ImageIcon />
                </TouchableOpacity>
                <TouchableOpacity className="border border-slive  p-2 rounded-3xl">
                    <ICONS.SmileyIcon />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSubmit(onFormSubmit)}
                    className="flex-row items-center gap-1 bg-slive p-2 rounded-2xl"
                >
                    <Text className="text-white text-center px-3">
                        Публікація
                    </Text>
                    <ICONS.SendPostIcon width={20} height={20} />
                </TouchableOpacity>
            </View>
        </>
    );
}
