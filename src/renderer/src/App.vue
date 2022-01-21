<template>
  <div class="h-screen w-screen flex flex-col pt-12">
    <nav
      class="w-screen items-center flex justify-center z-0 fixed top-0 py-2"
      style="-webkit-app-region: drag"
    >
      <h1 class="text-sm text-sky-500 font-medium">Ghost Note</h1>
    </nav>

    <transition name="fade" appear>
      <div class="grid grid-flow-col h-full divide-x divide-gray-300 gap-2">
        <div
          v-for="(pane, index) in panes"
          :key="`pane-${index}`"
          class="h-full p-4"
        >
          <div class="h-full grid grid-flow-row divide-y divide-gray-300 gap-2">
            <textarea
              :ref="`textarea-${index}`"
              v-model="pane.text"
              @keydown.meta.e.exact="closePane(index)"
              @keydown.ctrl.e.exact="closePane(index)"
              @keydown.meta.d.exact="addPaneHorizontally(index)"
              @keydown.ctrl.d.exact="addPaneHorizontally(index)"
              @keydown.meta.shift.d.exact="addPaneVertically(index)"
              @keydown.ctrl.shift.d.exact="addPaneVertically(index)"
              class="w-full h-full appearance-none resize-none leading-relaxed focus:outline-none bg-transparent caret-sky-500 selection:bg-sky-200 selection:text-sky-900"
            />

            <textarea
              v-for="(pane, paneIndex) in pane.panes"
              :key="`pane-${index}-${paneIndex}`"
              :ref="`textarea-${index}-${paneIndex}`"
              v-model="pane.text"
              @keydown.meta.e.exact="closePane(index, paneIndex)"
              @keydown.ctrl.e.exact="closePane(index, paneIndex)"
              @keydown.meta.d.exact="addPaneHorizontally(index)"
              @keydown.ctrl.d.exact="addPaneHorizontally(index)"
              @keydown.meta.shift.d.exact="addPaneVertically(index)"
              @keydown.ctrl.shift.d.exact="addPaneVertically(index)"
              class="w-full py-8 h-full appearance-none resize-none leading-relaxed focus:outline-none bg-transparent caret-sky-500 selection:bg-sky-200 selection:text-sky-900"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'App',

    data() {
      return {
        panes: [
          {
            text: '',
            panes: [],
          },
        ],
      }
    },

    methods: {
      closePane(index, childIndex = null) {
        const isChildPane = childIndex !== null;

        let paneIndexToFocusOn = null;
        let currentPaneIndex = isChildPane ? childIndex : index;
        let panes = isChildPane ? this.panes[index].panes : this.panes;

        if (! isChildPane && this.panes.length == 1) {
          return;
        }

        // try to grab a previous pane first
        if (panes?.[currentPaneIndex - 1] != 'undefined') {
          paneIndexToFocusOn = currentPaneIndex - 1;
        }

        // Otherwise - default to the next pane
        if (paneIndexToFocusOn === null && panes?.[currentPaneIndex + 1] != 'undefined') {
          paneIndexToFocusOn = currentPaneIndex + 1;
        }

        // Remove the given pane
        panes.splice(currentPaneIndex, 1);

        if (isChildPane) {
          if (paneIndexToFocusOn === null || paneIndexToFocusOn === -1) {
            this.$nextTick(() => this.focusPane(index))

            return;
          }

          this.$nextTick(() => this.focusPane(index, paneIndexToFocusOn));

          return;
        }

        // Set focus state on a different pane
        paneIndexToFocusOn != null && this.$nextTick(() => this.focusPane(paneIndexToFocusOn));
      },

      focusPane(parentIndex, childIndex = null) {
        const ref = childIndex !== null
          ? `textarea-${parentIndex}-${childIndex}`
          : `textarea-${parentIndex}`;

        this.$refs[ref]?.[0].focus();
      },

      addPaneHorizontally(index) {
        this.panes.push({
          text: '',
          panes: [],
        });

        this.$nextTick(() => this.focusPane(this.panes.length - 1));
      },

      addPaneVertically(index) {
        this.panes[index].panes.push({
          text: '',
        });

        this.$nextTick(() => this.focusPane(index, this.panes[index].panes.length - 1));
      }
    },
  }
</script>
