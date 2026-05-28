import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';

import { HomeIcon } from '@/components/icons/home-icon';
import { NotebookIcon } from '@/components/icons/notebook-icon';
import { ProfileIcon } from '@/components/icons/profile-icon';
import { BottomNavBar } from '@/components/navigation/bottom-nav-bar';
import { CreateNoteSheet, type CreateNoteSheetHandle } from '@/components/notes/create-note-sheet';
import { NavTabItem } from '@/components/navigation/nav-tab-item';

const TAB_SLOT = StyleSheet.create({
  home: {
    position: 'absolute',
    left: 4,
    width: 72,
  },
  notebooks: {
    position: 'absolute',
    left: 80,
    width: 88,
  },
  profile: {
    position: 'absolute',
    right: 4,
    width: 72,
  },
});

export default function AppTabs() {
  const createNoteSheetRef = useRef<CreateNoteSheetHandle>(null);

  return (
    <BottomSheetModalProvider>
      <Tabs>
        <TabSlot style={styles.slot} />
        {/*
          Route registration: TabList only picks up direct TabTrigger children.
          Our bar wraps triggers in views, so we register routes here (hidden) and
          mirror them in BottomNavBar without href (expo-router/ui pattern).
        */}
        <TabList style={styles.hiddenTabList}>
          <TabTrigger name="index" href="/" />
          <TabTrigger name="notebooks" href="/notebooks" />
          <TabTrigger name="profile" href="/profile" />
        </TabList>
        <BottomNavBar onCapturePress={() => createNoteSheetRef.current?.present()}>
          <TabTrigger name="index" asChild>
            <NavTabItem
              label="Home"
              slotStyle={TAB_SLOT.home}
              renderIcon={(color) => <HomeIcon size={24} color={color} />}
            />
          </TabTrigger>
          <TabTrigger name="notebooks" asChild>
            <NavTabItem
              label="Notebooks"
              slotStyle={TAB_SLOT.notebooks}
              renderIcon={(color) => <NotebookIcon size={24} color={color} />}
            />
          </TabTrigger>
          <TabTrigger name="profile" asChild>
            <NavTabItem
              label="Profile"
              slotStyle={TAB_SLOT.profile}
              renderIcon={(color) => <ProfileIcon size={24} color={color} />}
            />
          </TabTrigger>
        </BottomNavBar>
      </Tabs>
      <CreateNoteSheet ref={createNoteSheetRef} />
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
  },
  hiddenTabList: {
    display: 'none',
  },
});
