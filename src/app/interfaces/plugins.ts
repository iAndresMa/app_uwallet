import { PluginListenerHandle } from "@capacitor/core";

export interface StatusMonitorPlugin {
    addListener(eventName: 'bluetoothStatusChange', listenerFunc: (status: { status: string }) => void): Promise<PluginListenerHandle> & PluginListenerHandle;
    addListener(eventName: 'locationStatusChange', listenerFunc: (status: { status: string }) => void): Promise<PluginListenerHandle> & PluginListenerHandle;
}

export interface SDKDMAPlugin {
    getButtonReadersInRange(options: { codeInvitacion: string }): Promise<{ buttonReaderIds: any }>,
    open(options: { id: string }): Promise<{ result: any }>
}