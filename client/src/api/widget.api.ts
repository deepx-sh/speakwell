import { api } from "./axios";
import type { IApiResponse, IWidgetSettings } from "@/types";

export const getWidgetSettingsApi = () =>
    api.get<IApiResponse<IWidgetSettings>>("/widget/settings")

export const updateWidgetSettingsApi = (data: Partial<IWidgetSettings>) =>
    api.patch<IApiResponse<IWidgetSettings>>("/widget/settings", data)

export const getEmbedSnippetApi = (token: string) =>
    api.get<IApiResponse<{snippet:string}>>(`/widget/snippet/${token}`)