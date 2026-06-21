import useSWR from "swr";
import { getWidgetSettingsApi, updateWidgetSettingsApi } from "@/api/widget.api";
import type { IWidgetSettings } from "@/types";

export const useWidgetSettings = () => {
    const {data,error,isLoading,mutate} =useSWR(
        "/widget/settings",
        async()=>(await getWidgetSettingsApi()).data.data
    )

    const updateSettings = async (patch: Partial<IWidgetSettings>) => {
        const res = await updateWidgetSettingsApi(patch)
        mutate(res.data.data, false)
        return res.data.data
    }

    return {
        settings: data,
        isLoading,
        error,
        updateSettings,
        mutate
    }
}