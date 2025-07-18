import { Controller, useForm } from "react-hook-form";
import { ICreateAlbumForm } from "../../../types";
import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "../../../../../shared/ui/input";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { useTags } from "../../../../posts/hooks/use-tags";
import { renderError } from "../../../../../shared/utils/errors";
import { CreateAlbumPayload } from "../../../components/users-ctx/user/context";

export function AlbumForm({
    defaultValues,
    onSubmit,
    isPartialForm,
    onSuccess,
    close,
}: {
    defaultValues?: ICreateAlbumForm;
    onSubmit: (data: CreateAlbumPayload) => Promise<string | void>;
    isPartialForm?: boolean;
    onSuccess?: () => void;
    close: () => void;
}) {
    const { tags } = useTags();

    const {
        handleSubmit,
        control,
        setError,
        setValue,
        formState: { errors },
    } = useForm<ICreateAlbumForm>({ defaultValues });
    useEffect(() => {
        if (!tags.length || defaultValues?.topic_id) return
        setValue("topic_id", tags[0].id.toString())
    }, [tags])
    const onFormSubmit = async (data: ICreateAlbumForm) => {
        const errMsg = await onSubmit({ name: data.name, topic: tags.find(tag => tag.id == Number(data.topic_id))! })
        if (errMsg) {
            return setError("root", { message: errMsg });
        }
        onSuccess && onSuccess();
    };

    return (
        <>
            <View className="gap-2">
                <Controller
                    control={control}
                    name="name"
                    rules={{
                        required: {
                            value: !isPartialForm,
                            message: "Назва альбому обов’язкова",
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
                                placeholder="Напишіть назву альбому"
                                onChange={field.onChange}
                                onChangeText={field.onChange}
                                value={field.value}
                                label="Назва альбому"
                                autoCorrect={false}
                                err={fieldState.error}
                            />
                        );
                    }}
                />
                <Controller
                    control={control}
                    name="topic_id"
                    rules={{
                        required: {
                            value: !isPartialForm,
                            message: "Тема обов’язкова",
                        }
                    }}
                    render={({ field, fieldState }) => {
                        return (
                            <View>
                                <Text>Оберіть тему</Text>
                                <View className="border border-grey rounded-xl p-1">
                                    <Picker
                                        // selectedValue={selectedTopic}
                                        // onValueChange={(itemValue, itemIndex) =>
                                        //     setSelectedTopic(itemValue)
                                        // }
                                        selectedValue={field.value}
                                        onValueChange={(itemValue) =>
                                            field.onChange(itemValue)
                                        }
                                    >
                                        {tags.map((tag) => {
                                            return (
                                                <Picker.Item
                                                    key={tag.id}
                                                    label={tag.name}
                                                    value={tag.id.toString()}
                                                />
                                            );
                                        })}
                                    </Picker>
                                </View>
                                {fieldState.error && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {fieldState.error.message}
                                    </Text>
                                )}
                            </View>
                        );
                    }}
                />
                {/* <Controller
                    control={control}
                    name="created_at"
                    rules={{
                        required: {
                            value: !isPartialForm,
                            message: "Назва альбому обов’язкова",
                        },
                        maxLength: {
                            value: 50,
                            message: "Максимум 50 символів",
                        },
                    }}
                    render={() => {
                        return (
                            <View>
                                <Text>Рік альбому</Text>
                                <Picker
                                    className="flex-row rounded-xl px-4 border border-grey"
                                    selectedValue={selectedTopic}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setSelectedTopic(itemValue)
                                    }
                                >
                                    {tags.map((tag) => {
                                        return (
                                            <Picker.Item
                                                label={tag.name}
                                                value={tag.name}
                                            />
                                        );
                                    })}
                                </Picker>
                            </View>
                        );
                    }}
                /> */}
                {renderError(errors.root)}
                <View className="w-full flex-row justify-end gap-2 pb-8 pr-2 mt-12">
                    <TouchableOpacity
                        onPress={close}
                        className="flex-row items-center gap-1 border border-slive p-2 rounded-[1234]"
                    >
                        <Text className="text-black text-center px-3">
                            Скасувати
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSubmit(onFormSubmit)}
                        className="flex-row items-center gap-1 bg-slive p-2 rounded-[1234]"
                    >
                        <Text className="text-white text-center px-3">
                            Зберегти
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}
